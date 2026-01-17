'use client';

import React from 'react';
import { Package, ShoppingCart, Settings, Image as ImageIcon, Layout, Grid3X3, Sparkles, Eye, LogOut, Home, MessageSquare, Menu, X, Mail } from 'lucide-react';

type Tab = 'dashboard' | 'products' | 'hero' | 'categories' | 'featured' | 'newarrivals' | 'reviews' | 'messages' | 'orders' | 'settings';

interface AdminSidebarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'hero', icon: ImageIcon, label: 'Hero Slides' },
        { id: 'categories', icon: Layout, label: 'Categories' },
        { id: 'featured', icon: Grid3X3, label: 'Featured' },
        { id: 'newarrivals', icon: Sparkles, label: 'New Arrivals' },
        { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
        { id: 'messages', icon: Mail, label: 'Messages' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    return (
        <>
            {/* Mobile Header & Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-charcoal z-50 flex items-center justify-between px-4 shadow-md">
                <h1 className="font-playfair text-lg font-bold tracking-tight text-white">
                    <span className="text-gold-primary">SANDS</span> ADMIN
                </h1>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop Sidebar - Fixed */}
            <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-72 bg-charcoal text-white z-40 p-6 flex-col shadow-2xl">
                <div className="mb-10 pl-2">
                    <h1 className="font-playfair text-2xl font-bold tracking-tight">
                        <span className="text-gold-primary">SANDS</span> <span className="text-white/90">ADMIN</span>
                    </h1>
                    <p className="text-xs text-white/40 mt-1 font-medium tracking-widest uppercase">Control Panel</p>
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-gold-primary text-white shadow-lg shadow-gold-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}
                            />
                            <span className="font-medium tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-r" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Eye size={18} className="group-hover:text-gold-primary transition-colors" />
                        <span className="font-medium">View Storefront</span>
                    </a>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group">
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar - Slide In */}
            <aside className={`
                lg:hidden fixed top-0 left-0 h-screen w-72 bg-charcoal text-white z-40 p-6 flex flex-col shadow-2xl
                transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Mobile Spacing for Header */}
                <div className="h-12" />

                <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as Tab);
                                setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-gold-primary text-white shadow-lg shadow-gold-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}
                            />
                            <span className="font-medium tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-r" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Eye size={18} className="group-hover:text-gold-primary transition-colors" />
                        <span className="font-medium">View Storefront</span>
                    </a>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group">
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}

