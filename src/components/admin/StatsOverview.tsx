'use client';

import React from 'react';
import { Package, Layout, Grid3X3, Sparkles, PlusCircle, ExternalLink, TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsOverview({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
    const [greeting, setGreeting] = React.useState('Welcome'); // Default server-safe value

    // State for stats
    const [statsData, setStatsData] = React.useState({
        totalCheckouts: 0,
        totalVisits: 0,
        activeUsersToday: 0,
        activeProducts: 0
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Set greeting on client side only to avoid hydration mismatch
        const hours = new Date().getHours();
        setGreeting(hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening');

        async function fetchStats() {
            try {
                // Dynamically import to safely use firestore
                const { getStoreStats, getActiveProductsCount } = await import('@/lib/firestore');
                const storeStats = await getStoreStats();
                const productCount = await getActiveProductsCount();

                setStatsData({
                    ...storeStats,
                    activeProducts: productCount
                });
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    const stats = [
        {
            label: 'Total Checkouts',
            value: isLoading ? '...' : (statsData.totalCheckouts ?? 0).toLocaleString(),
            icon: DollarSign,
            change: 'WhatsApp Clicks',
            color: 'bg-green-100 text-green-600'
        },
        {
            label: 'Total Visits',
            value: isLoading ? '...' : (statsData.totalVisits ?? 0).toLocaleString(),
            icon: ShoppingBag,
            change: 'All Time',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            label: 'Active Users',
            value: isLoading ? '...' : (statsData.activeUsersToday ?? 0).toLocaleString(),
            icon: Users,
            change: 'Today',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            label: 'Active Products',
            value: isLoading ? '...' : (statsData.activeProducts ?? 0).toLocaleString(),
            icon: TrendingUp,
            change: 'In Stock',
            color: 'bg-orange-100 text-orange-600'
        },
    ];

    const quickActions = [
        { label: 'Add New Product', icon: PlusCircle, tab: 'products', color: 'bg-gold-primary' },
        { label: 'Update Hero Slider', icon: Layout, tab: 'hero', color: 'bg-charcoal' },
        { label: 'Feature a Collection', icon: Grid3X3, tab: 'featured', color: 'bg-gray-600' },
        { label: 'Post New Arrival', icon: Sparkles, tab: 'newarrivals', color: 'bg-gray-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Greeting Section */}
            <div className="relative overflow-hidden rounded-3xl bg-charcoal text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Sparkles size={200} />
                </div>
                <div className="relative z-10">
                    <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
                        {greeting}, Admin
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl">
                        Welcome to your control center. Here's what's happening with your store today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-medium-gray mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <h3 className="text-xl font-bold text-charcoal pt-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(action.tab)}
                        className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-gold-primary/30 transition-all duration-300"
                    >
                        <div className={`p-4 rounded-2xl mb-4 text-white transition-transform duration-300 group-hover:scale-110 shadow-lg ${action.color}`}>
                            <action.icon size={28} />
                        </div>
                        <span className="font-medium text-charcoal group-hover:text-gold-primary transition-colors">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Recent Activity / Hints */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <ExternalLink size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal">View Your Storefront</h4>
                        <p className="text-sm text-medium-gray">Check how your changes look live on the website.</p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        className="ml-auto px-6 py-2 bg-white text-charcoal border border-gray-200 rounded-xl font-medium hover:bg-charcoal hover:text-white transition-all shadow-sm"
                    >
                        Visit Site
                    </a>
                </div>
            </div>
        </div>
    );
}
