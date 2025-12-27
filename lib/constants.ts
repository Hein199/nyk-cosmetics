export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const ROLES = {
    ADMIN: 'admin',
    SALESPERSON: 'salesperson',
    REGIONAL_SALES: 'regional_sales',
} as const;

export const INVENTORY_UNITS = {
    PIECES: 'Pcs',
    DOZEN: 'D',
    PACKAGE: 'PK',
    BOX: 'P',
} as const;