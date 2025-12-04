"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - replace with actual API calls
const mockShops = [
    {
        id: "shop-001",
        name: "Beauty Store A",
        address: "123 Main Street, Yangon",
        phone: "09-123-456-789",
        contactPerson: "Ma Aye",
        lastOrder: "2024-12-01",
    },
    {
        id: "shop-002",
        name: "Cosmetics Shop B",
        address: "456 Market Road, Mandalay",
        phone: "09-987-654-321",
        contactPerson: "Ko Zaw",
        lastOrder: "2024-11-28",
    },
    {
        id: "shop-003",
        name: "Salon C",
        address: "789 Beauty Lane, Yangon",
        phone: "09-111-222-333",
        contactPerson: "Ma Su",
        lastOrder: "2024-12-03",
    },
    {
        id: "shop-004",
        name: "Retail Store D",
        address: "321 Shopping Center, Naypyidaw",
        phone: "09-444-555-666",
        contactPerson: "U Kyaw",
        lastOrder: "2024-11-25",
    },
    {
        id: "shop-005",
        name: "Beauty Outlet E",
        address: "555 Fashion Street, Yangon",
        phone: "09-777-888-999",
        contactPerson: "Ma Thiri",
        lastOrder: "2024-12-02",
    },
    {
        id: "shop-006",
        name: "Glamour Shop F",
        address: "888 Style Avenue, Mandalay",
        phone: "09-333-444-555",
        contactPerson: "Ko Min",
        lastOrder: "2024-11-30",
    },
];

export default function ShopSelectionPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedShop, setSelectedShop] = useState<string | null>(null);

    const filteredShops = mockShops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectShop = (shopId: string) => {
        setSelectedShop(shopId);
    };

    const handleProceed = () => {
        if (selectedShop) {
            router.push(`/salesperson/new-order/${selectedShop}`);
        }
    };

    return (
        <div className="space-y-6 bg-[#FFCDC9] min-h-screen p-6 rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Select Shop</h1>
                    <p className="text-gray-500 mt-1">
                        Choose a shop to create a new order
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <Input
                    type="text"
                    placeholder="Search by shop name, address, or contact person..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500">
                {filteredShops.length} shop{filteredShops.length !== 1 ? "s" : ""} found
            </p>

            {/* Shop Grid */}
            {filteredShops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredShops.map((shop) => (
                        <Card
                            key={shop.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${selectedShop === shop.id
                                    ? "ring-2 ring-pink-500 border-pink-500"
                                    : "hover:border-gray-300"
                                }`}
                            onClick={() => handleSelectShop(shop.id)}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {shop.name}
                                        </h3>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-start gap-2 text-sm text-gray-500">
                                                <svg
                                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span className="line-clamp-2">{shop.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg
                                                    className="w-4 h-4 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                                <span>{shop.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg
                                                    className="w-4 h-4 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                <span>{shop.contactPerson}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedShop === shop.id && (
                                        <div className="flex-shrink-0 ml-2">
                                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">
                                        Last order: {shop.lastOrder}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No shops found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search query
                    </p>
                </div>
            )}

            {/* Proceed Button - Fixed at bottom on mobile */}
            {selectedShop && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 sm:relative sm:p-0 sm:bg-transparent sm:border-0">
                    <Button
                        onClick={handleProceed}
                        size="lg"
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                    >
                        Proceed with{" "}
                        {mockShops.find((s) => s.id === selectedShop)?.name}
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </Button>
                </div>
            )}

            {/* Spacer for fixed button on mobile */}
            {selectedShop && <div className="h-20 sm:h-0" />}
        </div>
    );
}
