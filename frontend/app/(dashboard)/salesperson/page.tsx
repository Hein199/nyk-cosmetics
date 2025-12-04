"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

// Mock data - replace with actual API calls
const mockUser = {
    name: "Thiri",
};

// Enhanced mock orders with more data for filtering
const mockOrders = [
    // Current date orders (December 2025)
    { id: "ORD-001", customer: "Beauty Store A", amount: 125000, status: "completed", date: "2025-12-05", time: "10:30 AM" },
    { id: "ORD-002", customer: "Cosmetics Shop B", amount: 89000, status: "pending", date: "2025-12-05", time: "02:15 PM" },
    { id: "ORD-003", customer: "Modern Salon", amount: 156000, status: "processing", date: "2025-12-05", time: "04:20 PM" },
    
    // Recent past dates (December 2025)
    { id: "ORD-004", customer: "Salon C", amount: 234000, status: "processing", date: "2025-12-04", time: "11:45 AM" },
    { id: "ORD-005", customer: "Retail Store D", amount: 156000, status: "completed", date: "2025-12-04", time: "04:20 PM" },
    { id: "ORD-006", customer: "Beauty Outlet E", amount: 78000, status: "cancelled", date: "2025-12-03", time: "09:00 AM" },
    { id: "ORD-007", customer: "Makeup Corner F", amount: 189000, status: "completed", date: "2025-12-02", time: "03:30 PM" },
    { id: "ORD-008", customer: "Glamour Shop G", amount: 245000, status: "completed", date: "2025-12-01", time: "11:00 AM" },
    
    // March 2025 orders (example for date filtering)
    { id: "ORD-009", customer: "Glam Studio G", amount: 195000, status: "completed", date: "2025-03-08", time: "01:15 PM" },
    { id: "ORD-010", customer: "Style Shop H", amount: 267000, status: "completed", date: "2025-03-08", time: "05:45 PM" },
    { id: "ORD-011", customer: "Beauty Haven I", amount: 134000, status: "pending", date: "2025-03-07", time: "10:00 AM" },
    { id: "ORD-012", customer: "Charm Boutique J", amount: 198000, status: "cancelled", date: "2025-03-06", time: "02:30 PM" },
    { id: "ORD-013", customer: "Elite Beauty K", amount: 445000, status: "completed", date: "2025-03-05", time: "11:15 AM" },
    { id: "ORD-014", customer: "Luxury Salon L", amount: 312000, status: "processing", date: "2025-03-04", time: "04:00 PM" },
    
    // November 2024 orders
    { id: "ORD-015", customer: "Beauty Central M", amount: 178000, status: "completed", date: "2024-11-30", time: "09:30 AM" },
    { id: "ORD-016", customer: "Glamour Point N", amount: 256000, status: "completed", date: "2024-11-29", time: "01:45 PM" },
    { id: "ORD-017", customer: "Style Center O", amount: 89000, status: "pending", date: "2024-11-28", time: "03:20 PM" },
    
    // October 2024 orders (more test data)
    { id: "ORD-018", customer: "Beauty World P", amount: 167000, status: "completed", date: "2024-10-15", time: "10:15 AM" },
    { id: "ORD-019", customer: "Cosmetic Hub Q", amount: 298000, status: "completed", date: "2024-10-15", time: "02:30 PM" },
    { id: "ORD-020", customer: "Style Palace R", amount: 123000, status: "pending", date: "2024-10-14", time: "11:45 AM" },
];

// Monthly target data
const monthlyTargets: Record<string, { target: number; achieved: number }> = {
    // 2024 data
    "2024-01": { target: 2800000, achieved: 2650000 },
    "2024-02": { target: 2900000, achieved: 2750000 },
    "2024-03": { target: 3100000, achieved: 2980000 },
    "2024-04": { target: 3200000, achieved: 3050000 },
    "2024-05": { target: 3300000, achieved: 3150000 },
    "2024-06": { target: 3400000, achieved: 3200000 },
    "2024-07": { target: 3500000, achieved: 3300000 },
    "2024-08": { target: 3600000, achieved: 3400000 },
    "2024-09": { target: 3700000, achieved: 3500000 },
    "2024-10": { target: 3800000, achieved: 3600000 },
    "2024-11": { target: 3900000, achieved: 3700000 },
    "2024-12": { target: 4000000, achieved: 3800000 },
    
    // 2025 data
    "2025-01": { target: 4100000, achieved: 3900000 },
    "2025-02": { target: 4200000, achieved: 4000000 },
    "2025-03": { target: 4300000, achieved: 4100000 },
    "2025-04": { target: 4400000, achieved: 4200000 },
    "2025-05": { target: 4500000, achieved: 4300000 },
    "2025-06": { target: 4600000, achieved: 4400000 },
    "2025-07": { target: 4700000, achieved: 4500000 },
    "2025-08": { target: 4800000, achieved: 4600000 },
    "2025-09": { target: 4900000, achieved: 4700000 },
    "2025-10": { target: 5000000, achieved: 4800000 },
    "2025-11": { target: 5100000, achieved: 4900000 },
    "2025-12": { target: 5200000, achieved: 1551000 }, // Current month - partial data
};

const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MM", {
        style: "currency",
        currency: "MMK",
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function SalespersonPage() {
    const router = useRouter();
    
    // Date selection state
    const [selectedDateYear, setSelectedDateYear] = useState("2025");
    const [selectedDateMonth, setSelectedDateMonth] = useState("12");
    const [selectedDateDay, setSelectedDateDay] = useState("05");
    
    // Monthly target state
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedMonthNum, setSelectedMonthNum] = useState("12");
    
    // Combine date parts for filtering
    const selectedDate = `${selectedDateYear}-${selectedDateMonth.padStart(2, '0')}-${selectedDateDay.padStart(2, '0')}`;
    
    // Combine year and month for monthly targets
    const selectedMonth = `${selectedYear}-${selectedMonthNum.padStart(2, '0')}`;
    
    // Filter orders by selected date
    const filteredOrders = useMemo(() => {
        return mockOrders.filter(order => order.date === selectedDate);
    }, [selectedDate]);
    
    // Calculate statistics for selected date
    const dayStats = useMemo(() => {
        const totalOrders = filteredOrders.length;
        const completedOrders = filteredOrders.filter(o => o.status === "completed").length;
        const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;
        const processingOrders = filteredOrders.filter(o => o.status === "processing").length;
        const cancelledOrders = filteredOrders.filter(o => o.status === "cancelled").length;
        const totalSales = filteredOrders
            .filter(o => o.status === "completed")
            .reduce((sum, order) => sum + order.amount, 0);
        
        return {
            totalOrders,
            completedOrders,
            pendingOrders,
            processingOrders,
            cancelledOrders,
            totalSales
        };
    }, [filteredOrders]);
    
    // Calculate monthly statistics
    const monthlyStats = useMemo(() => {
        const monthlyData = monthlyTargets[selectedMonth] || { target: 0, achieved: 0 };
        const progressPercentage = monthlyData.target > 0 
            ? Math.round((monthlyData.achieved / monthlyData.target) * 100) 
            : 0;
        
        return {
            ...monthlyData,
            progressPercentage
        };
    }, [selectedMonth]);
    
    // Get recent orders for the table (limit to 5)
    const recentOrdersForDisplay = filteredOrders.slice(0, 5);
    
    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };
    
    // Format month for display
    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };
    
    // Get number of days in a month
    const getDaysInMonth = (year: string, month: string) => {
        return new Date(parseInt(year), parseInt(month), 0).getDate();
    };
    
    // Helper function to set date quickly
    const setQuickDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        setSelectedDateYear(year);
        setSelectedDateMonth(month);
        setSelectedDateDay(day);
    };
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {mockUser.name}!
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Viewing data for {formatDate(selectedDate)}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                        onClick={() => router.push("/salesperson/products")}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Order
                    </Button>
                </div>
            </div>

            {/* Date and Month Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Date & Month Filter</CardTitle>
                    <CardDescription>Filter your sales data by specific date and month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label htmlFor="date-day-filter" className="block text-xs text-gray-500 mb-1">
                                        Day
                                    </label>
                                    <select
                                        id="date-day-filter"
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
                                    <label htmlFor="date-month-filter" className="block text-xs text-gray-500 mb-1">
                                        Month
                                    </label>
                                    <select
                                        id="date-month-filter"
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
                                    <label htmlFor="date-year-filter" className="block text-xs text-gray-500 mb-1">
                                        Year
                                    </label>
                                    <select
                                        id="date-year-filter"
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
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Target Period
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label htmlFor="year-filter" className="block text-xs text-gray-500 mb-1">
                                        Year
                                    </label>
                                    <select
                                        id="year-filter"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="month-filter" className="block text-xs text-gray-500 mb-1">
                                        Month
                                    </label>
                                    <select
                                        id="month-filter"
                                        value={selectedMonthNum}
                                        onChange={(e) => setSelectedMonthNum(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        <option value="04">April</option>
                                        <option value="05">May</option>
                                        <option value="06">June</option>
                                        <option value="07">July</option>
                                        <option value="08">August</option>
                                        <option value="09">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Viewing: {formatMonth(selectedMonth)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Orders
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {dayStats.totalOrders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-pink-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Completed
                                </p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {dayStats.completedOrders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Pending
                                </p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">
                                    {dayStats.pendingOrders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Cancelled
                                </p>
                                <p className="text-3xl font-bold text-red-600 mt-1">
                                    {dayStats.cancelledOrders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Daily Sales</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(dayStats.totalSales)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Target Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Target - {formatMonth(selectedMonth)}</CardTitle>
                    <CardDescription>Sales performance against monthly target</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">Progress</div>
                            <div className="text-sm font-medium text-gray-900">
                                {monthlyStats.progressPercentage}%
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all"
                                style={{ width: `${Math.min(monthlyStats.progressPercentage, 100)}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-sm text-gray-500">Target</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(monthlyStats.target)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Achieved</p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatCurrency(monthlyStats.achieved)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Your latest order activity</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            View All Orders
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Mobile: Card layout */}
                    <div className="block sm:hidden space-y-4">
                        {recentOrdersForDisplay.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No orders found for {formatDate(selectedDate)}.</p>
                            </div>
                        ) : (
                            recentOrdersForDisplay.map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-lg p-4 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">{order.id}</span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-gray-600">{order.customer}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{order.date}</span>
                                    <span className="font-semibold text-gray-900">
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
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrdersForDisplay.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No orders found for {formatDate(selectedDate)}.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrdersForDisplay.map((order) => (
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
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}
                                            >
                                                {order.status}
                                            </span>
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