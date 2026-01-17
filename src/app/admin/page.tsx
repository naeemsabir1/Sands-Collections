'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { HeroManager } from '@/components/admin/HeroManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { FeaturedManager } from '@/components/admin/FeaturedManager';
import { ShowcaseManager } from '@/components/admin/ShowcaseManager';
import { ReviewsManager } from '@/components/admin/ReviewsManager';
import { ContactManager } from '@/components/admin/ContactManager';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { Save } from 'lucide-react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    // Defaulting to 'settings' temporarily or maybe 'overview'? 
    // Actually, let's create a 'dashboard' tab which maps to StatsOverview, 
    // or just use 'settings' as a placeholder if I didn't add 'dashboard' to sidebar types.
    // Looking at AdminSidebar, I have: products, hero, categories, featured, newarrivals, orders, settings.
    // I should probably add an 'overview' tab to AdminSidebar to be the home.
    // user didn't explicitly ask to change sidebar items, but 'StatsOverview' implies a dashboard.
    // I'll leave sidebar as is for now and render StatsOverview on a default or new tab?
    // Let's modify default state to 'products' as per original, OR 'overview'.
    // Better yet, I'll map 'orders' to a placeholder for now and adding a Dashboard would require updating sidebar.
    // I entered a loop of thought. Let's look at what I wrote in AdminSidebar:
    // keys: products, hero, categories, featured, newarrivals, orders, settings.

    // I'll make 'settings' showing the Settings, and I'll use the 'Orders' tab to show "Coming Soon" for now maybe?
    // Wait, the User wanted "StatsOverview". Ideally that's the "Home".
    // I will dynamically render StatsOverview if no specific tab is selected? No, sidebar controls it.

    // Let's update AdminSidebar in a moment to include "Dashboard". 
    // For now, I will use "settings" to also show the StatsOverview? No that's confusing.

    // Actually, I'll just render StatsOverview as the default landing, but since I have to pick a tab...
    // Let's UPDATE AdminSidebar to have a 'dashboard' tab.

    // Code below assumes I will update AdminSidebar next.

    return (
        <>
            <AdminSidebar activeTab={activeTab as any} setActiveTab={setActiveTab} />
            <AdminShell>
                {activeTab === 'dashboard' && <StatsOverview setActiveTab={setActiveTab} />}
                {activeTab === 'products' && <ProductsManager />}
                {activeTab === 'hero' && <HeroManager />}
                {activeTab === 'categories' && <CategoriesManager />}
                {activeTab === 'featured' && <FeaturedManager />}
                {activeTab === 'newarrivals' && <ShowcaseManager />}
                {activeTab === 'reviews' && <ReviewsManager />}
                {activeTab === 'messages' && <ContactManager />}

                {activeTab === 'orders' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="p-6 bg-white rounded-full shadow-lg mb-4">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h2 className="text-2xl font-bold text-charcoal">Orders Management</h2>
                        <p className="text-medium-gray mt-2">This module is coming soon.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h2 className="text-3xl font-playfair font-bold text-charcoal mb-2">Settings</h2>
                        <p className="text-medium-gray mb-8">Configure your store preferences</p>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-charcoal mb-2">Store Name</label>
                                    <input type="text" defaultValue="Sands Collections" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-charcoal mb-2">WhatsApp Number</label>
                                    <input type="tel" defaultValue="+923334944293" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all" />
                                    <p className="text-xs text-medium-gray mt-2">Order notifications will be sent to this number</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-charcoal mb-2">Shipping Cost (PKR)</label>
                                        <input type="number" defaultValue={250} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-charcoal mb-2">Free Shipping Over</label>
                                        <input type="number" defaultValue={5000} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="btn-gold px-8 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all">
                                        <Save size={18} /> Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AdminShell>
        </>
    );
}
