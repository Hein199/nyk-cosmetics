// ==========================================
// User Types
// ==========================================

export type UserRole = 'admin' | 'salesperson' | 'regional_sales';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    region?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDto {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    phone?: string;
    region?: string;
}

export interface UpdateUserDto {
    name?: string;
    phone?: string;
    region?: string;
}

// ==========================================
// Shop Types
// ==========================================

export interface Shop {
    id: string;
    name: string;
    address: string;
    phone: string;
    region?: string;
    contactPerson?: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShopDto {
    name: string;
    address: string;
    phone: string;
    region?: string;
    contactPerson?: string;
    email?: string;
}

export interface UpdateShopDto {
    name?: string;
    address?: string;
    phone?: string;
    region?: string;
    contactPerson?: string;
    email?: string;
}

// ==========================================
// Product Types
// ==========================================

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    unit: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    name: string;
    sku: string;
    price: number;
    stock: number;
    unit: string;
    description?: string;
    imageUrl?: string;
    category?: string;
}

export interface UpdateProductDto {
    name?: string;
    price?: number;
    stock?: number;
    unit?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    isActive?: boolean;
}

// ==========================================
// Order Types
// ==========================================

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    unit: string;
    subtotal: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    shopId: string;
    shopName: string;
    salespersonId: string;
    salespersonName: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    notes?: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderDto {
    shopId: string;
    items: CreateOrderItemDto[];
    notes?: string;
}

export interface CreateOrderItemDto {
    productId: string;
    quantity: number;
}

export interface UpdateOrderDto {
    status?: OrderStatus;
    notes?: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// ==========================================
// Auth Types
// ==========================================

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface TokenPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

// ==========================================
// Dashboard Types
// ==========================================

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    completedOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalShops: number;
    totalSalespersons: number;
}

export interface SalesReport {
    period: string;
    totalSales: number;
    orderCount: number;
    averageOrderValue: number;
}

// ==========================================
// Query Types
// ==========================================

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface OrderQuery extends PaginationQuery {
    status?: OrderStatus;
    shopId?: string;
    salespersonId?: string;
    startDate?: string;
    endDate?: string;
}

export interface ProductQuery extends PaginationQuery {
    category?: string;
    search?: string;
    isActive?: boolean;
}
