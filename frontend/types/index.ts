export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'salesperson' | 'regional_sales';
}

export interface Shop {
    id: string;
    name: string;
    address: string;
    phone: string;
    region?: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    unit: string;
    imageUrl?: string;
}

export interface Order {
    id: string;
    shopId: string;
    salespersonId: string;
    products: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'approved' | 'completed';
    createdAt: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    unit: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
