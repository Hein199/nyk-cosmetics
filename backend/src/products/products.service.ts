import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { sku: createProductDto.sku },
        });

        if (existingProduct) {
            throw new ConflictException('Product SKU already exists');
        }

        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    async findAll(page = 1, limit = 10, category?: string, search?: string) {
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = { isActive: true };

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.product.delete({
            where: { id },
        });

        return { message: 'Product deleted successfully' };
    }

    async updateStock(id: string, quantity: number) {
        const product = await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: { stock: product.stock + quantity },
        });
    }

    async getCategories() {
        const categories = await this.prisma.product.findMany({
            where: { isActive: true, category: { not: null } },
            select: { category: true },
            distinct: ['category'],
        });

        return categories.map((c) => c.category).filter(Boolean);
    }
}
