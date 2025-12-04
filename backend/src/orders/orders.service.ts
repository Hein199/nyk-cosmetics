import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrderStatus } from '@nyk/shared';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
    ) { }

    private generateOrderNumber(): string {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `ORD-${year}${month}${day}-${random}`;
    }

    async create(salespersonId: string, createOrderDto: CreateOrderDto) {
        // Validate products and calculate total
        let totalAmount = 0;
        const orderItems: { productId: string; quantity: number; price: number; subtotal: number }[] = [];

        for (const item of createOrderDto.items) {
            const product = await this.productsService.findOne(item.productId);

            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                subtotal,
            });
        }

        // Create order with items in a transaction
        const order = await this.prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    shopId: createOrderDto.shopId,
                    salespersonId,
                    totalAmount,
                    notes: createOrderDto.notes,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    shop: true,
                    salesperson: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            // Update product stock
            for (const item of createOrderDto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return newOrder;
        });

        return this.formatOrder(order);
    }

    async findAll(
        page = 1,
        limit = 10,
        status?: OrderStatus,
        shopId?: string,
        salespersonId?: string,
        startDate?: string,
        endDate?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (status) where.status = status;
        if (shopId) where.shopId = shopId;
        if (salespersonId) where.salespersonId = salespersonId;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
            if (endDate) (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    shop: true,
                    salesperson: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    approvedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            data: orders.map(this.formatOrder),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shop: true,
                salesperson: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                approvedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.formatOrder(order);
    }

    async updateStatus(id: string, updateOrderDto: UpdateOrderDto, userId?: string) {
        const order = await this.prisma.order.findUnique({ where: { id } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const updateData: Record<string, unknown> = {};

        if (updateOrderDto.status) {
            updateData.status = updateOrderDto.status;

            if (updateOrderDto.status === 'approved' && userId) {
                updateData.approvedById = userId;
                updateData.approvedAt = new Date();
            }
        }

        if (updateOrderDto.notes !== undefined) {
            updateData.notes = updateOrderDto.notes;
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shop: true,
                salesperson: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                approvedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return this.formatOrder(updatedOrder);
    }

    async remove(id: string) {
        const order = await this.prisma.order.findUnique({ where: { id } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== 'pending') {
            throw new BadRequestException('Only pending orders can be deleted');
        }

        await this.prisma.order.delete({ where: { id } });

        return { message: 'Order deleted successfully' };
    }

    async getStats() {
        const [totalOrders, pendingOrders, approvedOrders, completedOrders] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'pending' } }),
            this.prisma.order.count({ where: { status: 'approved' } }),
            this.prisma.order.count({ where: { status: 'completed' } }),
        ]);

        const totalRevenue = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['approved', 'completed'] } },
        });

        const [totalProducts, totalShops, totalSalespersons] = await Promise.all([
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.shop.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: 'salesperson', isActive: true } }),
        ]);

        return {
            totalOrders,
            pendingOrders,
            approvedOrders,
            completedOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalProducts,
            totalShops,
            totalSalespersons,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private formatOrder(order: any) {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            shopId: order.shopId,
            shopName: order.shop?.name,
            salespersonId: order.salespersonId,
            salespersonName: order.salesperson?.name,
            items: order.items.map((item: {
                id: string;
                productId: string;
                product: { name: string };
                quantity: number;
                price: number;
                subtotal: number;
            }) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product?.name,
                quantity: item.quantity,
                price: item.price,
                unit: 'pcs',
                subtotal: item.subtotal,
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            notes: order.notes,
            approvedBy: order.approvedBy?.name,
            approvedAt: order.approvedAt?.toISOString(),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
        };
    }
}
