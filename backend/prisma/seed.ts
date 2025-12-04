import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nyk.com' },
        update: {},
        create: {
            email: 'admin@nyk.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'admin',
            phone: '+959123456789',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create salesperson
    const salespersonPassword = await bcrypt.hash('sales123', 10);
    const salesperson = await prisma.user.upsert({
        where: { email: 'sales@nyk.com' },
        update: {},
        create: {
            email: 'sales@nyk.com',
            password: salespersonPassword,
            name: 'Sales Person',
            role: 'salesperson',
            phone: '+959987654321',
            region: 'Yangon',
        },
    });
    console.log('✅ Salesperson created:', salesperson.email);

    // Create sample shops
    const shops = await Promise.all([
        prisma.shop.upsert({
            where: { id: 'shop-1' },
            update: {},
            create: {
                id: 'shop-1',
                name: 'Beauty Corner',
                address: '123 Main Street, Yangon',
                phone: '+959111222333',
                region: 'Yangon',
                contactPerson: 'Ma Aye',
            },
        }),
        prisma.shop.upsert({
            where: { id: 'shop-2' },
            update: {},
            create: {
                id: 'shop-2',
                name: 'Glamour House',
                address: '456 Second Street, Mandalay',
                phone: '+959444555666',
                region: 'Mandalay',
                contactPerson: 'Ma Thin',
            },
        }),
    ]);
    console.log('✅ Sample shops created:', shops.length);

    // Create sample products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { sku: 'NYK-FC-001' },
            update: {},
            create: {
                name: 'NYK Face Cream',
                sku: 'NYK-FC-001',
                price: 15000,
                stock: 100,
                unit: 'box',
                category: 'Skincare',
                description: 'Premium face cream with natural ingredients',
            },
        }),
        prisma.product.upsert({
            where: { sku: 'NYK-LP-001' },
            update: {},
            create: {
                name: 'NYK Lipstick Red',
                sku: 'NYK-LP-001',
                price: 8000,
                stock: 200,
                unit: 'piece',
                category: 'Makeup',
                description: 'Long-lasting red lipstick',
            },
        }),
        prisma.product.upsert({
            where: { sku: 'NYK-SH-001' },
            update: {},
            create: {
                name: 'NYK Shampoo',
                sku: 'NYK-SH-001',
                price: 12000,
                stock: 150,
                unit: 'bottle',
                category: 'Haircare',
                description: 'Nourishing shampoo for all hair types',
            },
        }),
        prisma.product.upsert({
            where: { sku: 'NYK-SL-001' },
            update: {},
            create: {
                name: 'NYK Sunscreen Lotion',
                sku: 'NYK-SL-001',
                price: 18000,
                stock: 80,
                unit: 'tube',
                category: 'Skincare',
                description: 'SPF 50+ protection sunscreen',
            },
        }),
    ]);
    console.log('✅ Sample products created:', products.length);

    console.log('🎉 Database seeding completed!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@nyk.com / admin123');
    console.log('   Sales: sales@nyk.com / sales123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
