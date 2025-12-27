"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for orders - same as dashboard
const mockOrders = [
    // Current date orders (December 2025) 
    { id: "ORD-001", customer: "Beauty Store A", amount: 125000, status: "completed", date: "2025-12-05", time: "10:30 AM", items: 5, salesperson: "Thiri" },

    { id: "ORD-003", customer: "Modern Salon", amount: 156000, status: "processing", date: "2025-12-05", time: "04:20 PM", items: 4, salesperson: "Thiri" },
    
    // Recent past dates (December 2025)
    { id: "ORD-004", customer: "Salon C", amount: 234000, status: "processing", date: "2025-12-04", time: "11:45 AM", items: 8, salesperson: "Thiri" },
    { id: "ORD-005", customer: "Retail Store D", amount: 156000, status: "completed", date: "2025-12-04", time: "04:20 PM", items: 6, salesperson: "Thiri" },
    { id: "ORD-006", customer: "Beauty Outlet E", amount: 78000, status: "cancelled", date: "2025-12-03", time: "09:00 AM", items: 4, salesperson: "Thiri" },
    { id: "ORD-007", customer: "Makeup Corner F", amount: 189000, status: "completed", date: "2025-12-02", time: "03:30 PM", items: 7, salesperson: "Thiri" },
    { id: "ORD-008", customer: "Glamour Shop G", amount: 245000, status: "completed", date: "2025-12-01", time: "11:00 AM", items: 5, salesperson: "Thiri" },
    
    // March 2025 orders
    { id: "ORD-009", customer: "Glam Studio G", amount: 195000, status: "completed", date: "2025-03-08", time: "01:15 PM", items: 6, salesperson: "Thiri" },
    { id: "ORD-010", customer: "Style Shop H", amount: 267000, status: "completed", date: "2025-03-08", time: "05:45 PM", items: 9, salesperson: "Thiri" },

    { id: "ORD-012", customer: "Charm Boutique J", amount: 198000, status: "cancelled", date: "2025-03-06", time: "02:30 PM", items: 6, salesperson: "Thiri" },
    { id: "ORD-013", customer: "Elite Beauty K", amount: 445000, status: "completed", date: "2025-03-05", time: "11:15 AM", items: 8, salesperson: "Thiri" },
    
    // November 2024 orders
    { id: "ORD-014", customer: "Beauty Central M", amount: 178000, status: "completed", date: "2024-11-30", time: "09:30 AM", items: 5, salesperson: "Thiri" },
    { id: "ORD-015", customer: "Glamour Point N", amount: 256000, status: "completed", date: "2024-11-29", time: "01:45 PM", items: 7, salesperson: "Thiri" },

    
    // October 2024 orders
    { id: "ORD-017", customer: "Beauty World P", amount: 167000, status: "completed", date: "2024-10-15", time: "10:15 AM", items: 4, salesperson: "Thiri" },
    { id: "ORD-018", customer: "Cosmetic Hub Q", amount: 298000, status: "completed", date: "2024-10-15", time: "02:30 PM", items: 8, salesperson: "Thiri" },

];

const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "completed", label: "Completed" },
    { value: "processing", label: "Processing" },
    { value: "cancelled", label: "Cancelled" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MM", {
        style: "currency",
        currency: "MMK",
        minimumFractionDigits: 0,
    }).format(amount);
}

// Format date for display
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Get number of days in a month
function getDaysInMonth(year: string, month: string) {
    return new Date(parseInt(year), parseInt(month), 0).getDate();
}

export default function OrdersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // Date selection state
    const [selectedDateYear, setSelectedDateYear] = useState("2025");
    const [selectedDateMonth, setSelectedDateMonth] = useState("12");
    const [selectedDateDay, setSelectedDateDay] = useState("05");
    
    // Combine date parts for filtering
    const selectedDate = `${selectedDateYear}-${selectedDateMonth.padStart(2, '0')}-${selectedDateDay.padStart(2, '0')}`;

    // Filter and search orders
    const filteredOrders = useMemo(() => {
        return mockOrders.filter((order) => {
            // Date filter
            const matchesDate = order.date === selectedDate;
            
            // Status filter
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            
            // Search filter
            const matchesSearch = searchQuery === "" || 
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesDate && matchesStatus && matchesSearch;
        });
    }, [selectedDate, searchQuery, statusFilter]);

    // Calculate summary stats
    const orderStats = useMemo(() => {
        const total = mockOrders.length;
        const completed = mockOrders.filter(o => o.status === "completed").length;
        const processing = mockOrders.filter(o => o.status === "processing").length;
        
        return { total, completed, processing };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 mt-1">
                        Viewing orders for {formatDate(selectedDate)}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                        onClick={() => router.push("/salesperson/products")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Order
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {orderStats.total}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {orderStats.completed}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>



                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Processing</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">
                                    {orderStats.processing}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Filter and search through your orders</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Date Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-w-md">
                            <div>
                                <label htmlFor="orders-date-day-filter" className="block text-xs text-gray-500 mb-1">
                                    Day
                                </label>
                                <select
                                    id="orders-date-day-filter"
                                    value={selectedDateDay}
                                    onChange={(e) => setSelectedDateDay(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                >
                                    {Array.from({ length: getDaysInMonth(selectedDateYear, selectedDateMonth) }, (_, i) => {
                                        const day = (i + 1).toString().padStart(2, '0');
                                        return (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="orders-date-month-filter" className="block text-xs text-gray-500 mb-1">
                                    Month
                                </label>
                                <select
                                    id="orders-date-month-filter"
                                    value={selectedDateMonth}
                                    onChange={(e) => setSelectedDateMonth(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                >
                                    <option value="01">Jan</option>
                                    <option value="02">Feb</option>
                                    <option value="03">Mar</option>
                                    <option value="04">Apr</option>
                                    <option value="05">May</option>
                                    <option value="06">Jun</option>
                                    <option value="07">Jul</option>
                                    <option value="08">Aug</option>
                                    <option value="09">Sep</option>
                                    <option value="10">Oct</option>
                                    <option value="11">Nov</option>
                                    <option value="12">Dec</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="orders-date-year-filter" className="block text-xs text-gray-500 mb-1">
                                    Year
                                </label>
                                <select
                                    id="orders-date-year-filter"
                                    value={selectedDateYear}
                                    onChange={(e) => setSelectedDateYear(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Found {filteredOrders.length} orders for {formatDate(selectedDate)}
                        </p>
                        <div className="mt-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setSelectedDateYear("2025");
                                    setSelectedDateMonth("12");
                                    setSelectedDateDay("05");
                                }}
                                className="text-xs"
                            >
                                Today
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="flex-1">
                            <Input
                                placeholder="Search by Order ID or Customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        {/* Status Filter */}
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mobile: Card layout */}
                    <div className="block sm:hidden space-y-4">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No orders found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{order.id}</span>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customer}</p>
                                        <p className="text-sm text-gray-500">{order.items} items</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-gray-500">{order.date}</p>
                                            <p className="text-gray-500">{order.time}</p>
                                        </div>
                                        <span className="font-semibold text-gray-900 text-lg">
                                            {formatCurrency(order.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop: Table layout */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Order ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Customer
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Date
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Time
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Amount
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Items
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {order.id}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {order.customer}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {order.date}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {order.time}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(order.amount)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {order.items}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}