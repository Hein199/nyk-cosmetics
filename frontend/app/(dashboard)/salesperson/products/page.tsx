"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { INVENTORY_UNITS } from "@/lib/constants";

// Mock customer data
const mockCustomers = [
    { id: "CUST-001", name: "Beauty Store A", address: "123 Main Street, Yangon", phone: "09-123-456-789" },
    { id: "CUST-002", name: "Cosmetics Shop B", address: "456 Market Road, Mandalay", phone: "09-987-654-321" },
    { id: "CUST-003", name: "Salon C", address: "789 Beauty Lane, Yangon", phone: "09-111-222-333" },
    { id: "CUST-004", name: "Retail Store D", address: "321 Shopping Center, Naypyidaw", phone: "09-444-555-666" },
    { id: "CUST-005", name: "Beauty Outlet E", address: "555 Fashion Street, Yangon", phone: "09-777-888-999" },
    { id: "CUST-006", name: "Makeup Corner F", address: "666 Style Avenue, Mandalay", phone: "09-222-333-444" },
    { id: "CUST-007", name: "Glam Studio G", address: "777 Glamour Road, Yangon", phone: "09-555-666-777" },
    { id: "CUST-008", name: "Style Shop H", address: "888 Fashion Plaza, Naypyidaw", phone: "09-888-999-000" }
];

// Mock product data
const mockProducts = [
    {
        id: "PRD-001",
        name: "NYK Matte Lipstick Red",
        category: "Lipstick",
        price: 15000,
        image: "/api/placeholder/300/300",
        description: "Long-lasting matte finish lipstick",
        stock: 50
    },
    {
        id: "PRD-002", 
        name: "NYK Foundation Light",
        category: "Foundation",
        price: 25000,
        image: "/api/placeholder/300/300",
        description: "Full coverage liquid foundation",
        stock: 30
    },
    {
        id: "PRD-003",
        name: "NYK Eyeshadow Palette",
        category: "Eyeshadow",
        price: 35000,
        image: "/api/placeholder/300/300",
        description: "12-color eyeshadow palette",
        stock: 20
    },
    {
        id: "PRD-004",
        name: "NYK Mascara Black",
        category: "Mascara",
        price: 18000,
        image: "/api/placeholder/300/300",
        description: "Volumizing mascara",
        stock: 45
    },
    {
        id: "PRD-005",
        name: "NYK Blush Pink",
        category: "Blush",
        price: 12000,
        image: "/api/placeholder/300/300",
        description: "Natural pink blush",
        stock: 35
    },
    {
        id: "PRD-006",
        name: "NYK Concealer Medium",
        category: "Concealer",
        price: 20000,
        image: "/api/placeholder/300/300",
        description: "High coverage concealer",
        stock: 40
    },
    {
        id: "PRD-007",
        name: "NYK Highlighter Gold",
        category: "Highlighter",
        price: 22000,
        image: "/api/placeholder/300/300",
        description: "Shimmery gold highlighter",
        stock: 25
    },
    {
        id: "PRD-008",
        name: "NYK Lip Gloss Clear",
        category: "Lip Gloss",
        price: 10000,
        image: "/api/placeholder/300/300",
        description: "Glossy clear lip gloss",
        stock: 60
    }
];

interface CartItem {
    id: string;
    name: string;
    price: number;
    customPrice?: number;
    quantity: number;
    unit: string;
    total: number;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MM", {
        style: "currency",
        currency: "MMK",
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    
    const customerDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
                setShowCustomerDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Product filtering
    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            const matchesSearch = searchQuery === "" || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === "all" || 
                product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(mockProducts.map(p => p.category)));
        return ["all", ...cats];
    }, []);

    // Filter customers based on search
    const filteredCustomers = useMemo(() => {
        if (!customerSearch) return mockCustomers;
        return mockCustomers.filter(customer =>
            customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.phone.includes(customerSearch)
        );
    }, [customerSearch]);

    // Get selected customer details
    const selectedCustomerDetails = useMemo(() => {
        return mockCustomers.find(c => c.id === selectedCustomer);
    }, [selectedCustomer]);

    // Calculate totals
    const cartSummary = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal; // No tax applied
        
        return { subtotal, total, itemCount: cart.length };
    }, [cart]);

    // Add to cart function
    const addToCart = (productId: string, quantity: number, unit: string, customPrice?: number) => {
        const product = mockProducts.find(p => p.id === productId);
        if (!product || quantity <= 0) return;

        const finalPrice = customPrice !== undefined ? customPrice : product.price;
        const existingItemIndex = cart.findIndex(item => 
            item.id === productId && item.unit === unit && 
            (item.customPrice || item.price) === finalPrice
        );

        const itemTotal = finalPrice * quantity;

        if (existingItemIndex >= 0) {
            // Update existing item
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += quantity;
            updatedCart[existingItemIndex].total = updatedCart[existingItemIndex].quantity * finalPrice;
            setCart(updatedCart);
        } else {
            // Add new item
            const newItem: CartItem = {
                id: productId,
                name: product.name,
                price: product.price,
                customPrice: customPrice,
                quantity,
                unit,
                total: itemTotal
            };
            setCart([...cart, newItem]);
        }
    };

    // Remove from cart
    const removeFromCart = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar - Receipt */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Receipt Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Order Receipt</h2>
                    
                    {/* Customer Selection */}
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Customer
                        </label>
                        <div className="relative" ref={customerDropdownRef}>
                            <Input
                                placeholder="Search customers..."
                                value={customerSearch}
                                onChange={(e) => {
                                    setCustomerSearch(e.target.value);
                                    setShowCustomerDropdown(true);
                                }}
                                onFocus={() => setShowCustomerDropdown(true)}
                                className="w-full text-black font-medium"
                            />
                            
                            {/* Customer Dropdown */}
                            {showCustomerDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredCustomers.length === 0 ? (
                                        <div className="p-3 text-sm text-gray-800">No customers found</div>
                                    ) : (
                                        filteredCustomers.map((customer) => (
                                            <button
                                                key={customer.id}
                                                onClick={() => {
                                                    setSelectedCustomer(customer.id);
                                                    setCustomerSearch(customer.name);
                                                    setShowCustomerDropdown(false);
                                                }}
                                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-sm text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-700">{customer.phone}</div>
                                                <div className="text-xs text-gray-600 truncate">{customer.address}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Selected Customer Display */}
                        {selectedCustomerDetails && (
                            <div className="mt-2 p-2 bg-pink-50 border border-pink-200 rounded-md">
                                <div className="text-sm font-medium text-gray-900">{selectedCustomerDetails.name}</div>
                                <div className="text-xs text-gray-800">{selectedCustomerDetails.phone}</div>
                                <div className="text-xs text-gray-700 truncate">{selectedCustomerDetails.address}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-800 text-sm">No items in cart</p>
                            <p className="text-gray-700 text-xs mt-1">Add products to create an order</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${item.unit}-${index}`} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {item.name}
                                            </h4>
                                            <div className="mt-1 text-xs text-gray-700">
                                                <span className="text-black font-semibold">{item.quantity}</span> {item.unit} × <span className="text-black font-semibold">{formatCurrency(item.customPrice || item.price)}</span>
                                                {item.customPrice && (
                                                    <span className="ml-1 text-orange-800 font-medium">(Custom)</span>
                                                )}
                                            </div>
                                            {item.customPrice && (
                                                <div className="mt-1 text-xs text-gray-600">
                                                    Original: <span className="text-black font-semibold">{formatCurrency(item.price)}</span>
                                                </div>
                                            )}
                                            <div className="mt-1 text-sm font-medium text-black">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Receipt Summary */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-800">Subtotal (<span className="text-black font-semibold">{cartSummary.itemCount}</span> items)</span>
                                <span className="font-medium text-black">{formatCurrency(cartSummary.subtotal)}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-bold text-lg text-black">{formatCurrency(cartSummary.total)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Button 
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                                disabled={!selectedCustomer || cart.length === 0}
                            >
                                {!selectedCustomer ? 'Select Customer First' : 'Create Order'}
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content - Products */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-800 mt-1">Select products to create a new order</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-black font-medium"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black font-medium"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No products found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Product Card Component
interface ProductCardProps {
    product: typeof mockProducts[0];
    onAddToCart: (productId: string, quantity: number, unit: string, customPrice?: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<string>(INVENTORY_UNITS.PIECES);
    const [customPrice, setCustomPrice] = useState<string>("");
    const [useCustomPrice, setUseCustomPrice] = useState(false);

    const handleAddToCart = () => {
        const finalCustomPrice = useCustomPrice && customPrice ? parseFloat(customPrice) : undefined;
        onAddToCart(product.id, quantity, selectedUnit, finalCustomPrice);
        // Reset to default values
        setQuantity(1);
        setSelectedUnit(INVENTORY_UNITS.PIECES);
        setCustomPrice("");
        setUseCustomPrice(false);
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-black">
                    {product.stock} in stock
                </div>
            </div>
            <CardHeader className="pb-2 border-b-0">
                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">{product.category}</span>
                    <span className="text-lg font-bold text-black">{formatCurrency(product.price)}</span>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Quantity and Unit Selection */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-800 mb-1">Qty</label>
                            <Input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="text-sm text-black font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-800 mb-1">Unit</label>
                            <select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                className="w-full px-2 py-1.5 text-sm text-black font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value={INVENTORY_UNITS.PIECES}>Pcs</option>
                                <option value={INVENTORY_UNITS.DOZEN}>Dozen</option>
                                <option value={INVENTORY_UNITS.PACKAGE}>Package</option>
                                <option value={INVENTORY_UNITS.BOX}>Box</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Custom Price Section */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`custom-price-${product.id}`}
                                checked={useCustomPrice}
                                onChange={(e) => setUseCustomPrice(e.target.checked)}
                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label 
                                htmlFor={`custom-price-${product.id}`}
                                className="text-xs text-gray-800 cursor-pointer"
                            >
                                Custom Price
                            </label>
                        </div>
                        
                        {useCustomPrice && (
                            <div>
                                <label className="block text-xs text-gray-800 mb-1">Custom Price (MMK)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    placeholder={`Default: ${formatCurrency(product.price)}`}
                                    className="text-sm text-black font-medium"
                                />
                            </div>
                        )}
                    </div>
                    
                    <Button 
                        onClick={handleAddToCart}
                        className="w-full text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}