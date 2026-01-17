'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, RefreshCw, Grid3X3 } from 'lucide-react';
import { FeaturedCollection } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';
import { getFeaturedCollections, addFeaturedCollection, updateFeaturedCollection, deleteFeaturedCollection } from '@/lib/firestore';
import Image from 'next/image';

const linkOptions = [
    { value: '/men/shawls', label: "Men's Shawls" },
    { value: '/men/unstitched-suiting', label: "Men's Unstitched Suiting" },
    { value: '/women/shawls', label: "Women's Shawls" },
    { value: '/women/duppattas', label: "Duppattas" },
    { value: '/fragrances/mens', label: 'Fragrances - Mens' },
    { value: '/fragrances/womens', label: 'Fragrances - Womens' },
    { value: '/fragrances/unisex', label: 'Fragrances - Unisex' },
    { value: '/beadwork', label: 'Beadwork' },
    { value: '/ihram', label: 'Ihram' },
];

export function FeaturedManager() {
    const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingFeatured, setIsAddingFeatured] = useState(false);
    const [editingFeatured, setEditingFeatured] = useState<FeaturedCollection | null>(null);

    const [featuredForm, setFeaturedForm] = useState<Partial<FeaturedCollection>>({
        title: '',
        subtitle: '',
        image: '',
        href: '/men/shawls',
        span: 'medium',
        order: 0,
    });

    useEffect(() => {
        loadFeatured();
    }, []);

    const loadFeatured = async () => {
        setIsLoading(true);
        try {
            const fetchedFeatured = await getFeaturedCollections();
            setFeaturedCollections(fetchedFeatured);
        } catch (error) {
            console.error('Error loading featured collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveFeatured = async () => {
        if (!featuredForm.title || !featuredForm.image || !featuredForm.href) {
            alert('Please fill in all required fields (Title, Image, Category Link)');
            return;
        }
        setIsSaving(true);

        try {
            const featuredData = {
                title: featuredForm.title || '',
                subtitle: featuredForm.subtitle || '',
                image: convertDriveLink(featuredForm.image || ''),
                href: featuredForm.href || '/men/shawls',
                span: featuredForm.span || 'medium',
                order: featuredForm.order || 0,
            };

            if (editingFeatured) {
                await updateFeaturedCollection(editingFeatured.id, featuredData);
            } else {
                await addFeaturedCollection(featuredData as Omit<FeaturedCollection, 'id'>);
            }

            await loadFeatured();
            resetFeaturedForm();
        } catch (error) {
            console.error('Error saving featured:', error);
            alert('Failed to save featured collection. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteFeatured = async (id: string) => {
        if (confirm('Are you sure you want to delete this collection?')) {
            try {
                await deleteFeaturedCollection(id);
                loadFeatured();
            } catch (error) {
                console.error('Error deleting featured:', error);
            }
        }
    };

    const handleEditFeatured = (featured: FeaturedCollection) => {
        setEditingFeatured(featured);
        setFeaturedForm(featured);
        setIsAddingFeatured(true);
    };

    const resetFeaturedForm = () => {
        setEditingFeatured(null);
        setIsAddingFeatured(false);
        setFeaturedForm({
            title: '',
            subtitle: '',
            image: '',
            href: '/men/shawls',
            span: 'medium',
            order: featuredCollections.length,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Featured Collections</h2>
                    <p className="text-medium-gray mt-1">Manage the bento grid highlights on home</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadFeatured} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => {
                            setFeaturedForm({ ...featuredForm, order: featuredCollections.length });
                            setIsAddingFeatured(true);
                        }}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Collection
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredCollections.map((featured) => (
                        <div key={featured.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                            <div className="relative h-64">
                                <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="300px" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <h4 className="font-playfair text-2xl font-bold">{featured.title}</h4>
                                    <p className="text-white/80 text-sm mt-1">{featured.subtitle}</p>
                                </div>
                                <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold capitalize">
                                    Size: {featured.span}
                                </span>
                            </div>
                            <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                                <span className="text-xs font-semibold text-charcoal/60 bg-gray-100 px-2 py-1 rounded">
                                    Order: {featured.order}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditFeatured(featured)} className="p-2 hover:bg-gold-primary/10 text-medium-gray hover:text-gold-primary rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteFeatured(featured.id)} className="p-2 hover:bg-red-50 text-medium-gray hover:text-red-500 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {featuredCollections.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Grid3X3 size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-lg font-medium text-charcoal">No featured collections</p>
                </div>
            )}

            {/* Featured Modal */}
            <AnimatePresence>
                {isAddingFeatured && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetFeaturedForm}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-playfair text-2xl font-bold text-charcoal">{editingFeatured ? 'Edit Collection' : 'New Collection'}</h3>
                                <button onClick={resetFeaturedForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-charcoal"><X size={24} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Title *</label>
                                    <input
                                        value={featuredForm.title || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="e.g. Elegant Shawls"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Subtitle</label>
                                    <input
                                        value={featuredForm.subtitle || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, subtitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="e.g. Winter Collection"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Image URL *</label>
                                    <input
                                        value={featuredForm.image || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="Google Drive link"
                                    />
                                    {featuredForm.image && (
                                        <div className="relative mt-2 w-full h-32 rounded-xl overflow-hidden bg-gray-100">
                                            <Image src={convertDriveLink(featuredForm.image)} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Link *</label>
                                    <select
                                        value={featuredForm.href || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, href: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select page...</option>
                                        {linkOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-charcoal">Grid Size</label>
                                        <select
                                            value={featuredForm.span || 'medium'}
                                            onChange={(e) => setFeaturedForm({ ...featuredForm, span: e.target.value as any })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all appearance-none"
                                        >
                                            <option value="small">Small (1x1)</option>
                                            <option value="medium">Medium (1x2)</option>
                                            <option value="large">Large (2x2)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-charcoal">Order</label>
                                        <input
                                            type="number"
                                            value={featuredForm.order || 0}
                                            onChange={(e) => setFeaturedForm({ ...featuredForm, order: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                                <button onClick={resetFeaturedForm} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-white transition-all">Cancel</button>
                                <button
                                    onClick={handleSaveFeatured}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gold-primary transition-all shadow-lg flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingFeatured ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
