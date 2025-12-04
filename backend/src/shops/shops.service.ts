import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto, UpdateShopDto } from './dto';

@Injectable()
export class ShopsService {
    constructor(private prisma: PrismaService) { }

    async create(createShopDto: CreateShopDto) {
        return this.prisma.shop.create({
            data: createShopDto,
        });
    }

    async findAll(page = 1, limit = 10, region?: string) {
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = { isActive: true };

        if (region) {
            where.region = region;
        }

        const [shops, total] = await Promise.all([
            this.prisma.shop.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.shop.count({ where }),
        ]);

        return {
            data: shops,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
        });

        if (!shop) {
            throw new NotFoundException('Shop not found');
        }

        return shop;
    }

    async update(id: string, updateShopDto: UpdateShopDto) {
        await this.findOne(id);

        return this.prisma.shop.update({
            where: { id },
            data: updateShopDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.shop.delete({
            where: { id },
        });

        return { message: 'Shop deleted successfully' };
    }

    async getRegions() {
        const regions = await this.prisma.shop.findMany({
            where: { isActive: true, region: { not: null } },
            select: { region: true },
            distinct: ['region'],
        });

        return regions.map((r) => r.region).filter(Boolean);
    }
}
