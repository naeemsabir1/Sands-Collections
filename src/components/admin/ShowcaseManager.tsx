'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, RefreshCw, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import { NewArrivalShowcase, Product, ProductCategory } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';
import { getNewArrivalShowcases, addNewArrivalShowcase, updateNewArrivalShowcase, deleteNewArrivalShowcase, getProducts } from '@/lib/firestore';
import Image from 'next/image';

const productCategories: { value: ProductCategory; label: string }[] = [
    { value: 'mens-shawls', label: "Men's Shawls" },
    { value: 'mens-unstitched-suiting', label: "Men's Unstitched Suiting" },
    { value: 'womens-shawls', label: "Women's Shawls" },
    { value: 'womens-duppattas', label: "Duppattas" },
    { value: 'fragrances-mens', label: 'Fragrances - Mens' },
    { value: 'fragrances-womens', label: 'Fragrances - Womens' },
    { value: 'fragrances-unisex', label: 'Fragrances - Unisex' },
    { value: 'ihram-ladies', label: 'Ladies Ihram' },
    { value: 'ihram-gents', label: 'Gents Ihram' },
];

export function ShowcaseManager() {
    const [showcases, setShowcases] = useState<NewArrivalShowcase[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingShowcase, setIsAddingShowcase] = useState(false);
    const [editingShowcase, setEditingShowcase] = useState<NewArrivalShowcase | null>(null);

    const [showcaseForm, setShowcaseForm] = useState<Partial<NewArrivalShowcase>>({
        media: '',
        mediaType: 'image',
        linkedProductId: '',
        title: '',
        order: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fetchedShowcases, fetchedProducts] = await Promise.all([
                getNewArrivalShowcases(),
                getProducts()
            ]);
            setShowcases(fetchedShowcases);
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error loading showcase data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveShowcase = async () => {
        if (!showcaseForm.media || !showcaseForm.linkedProductId) {
            alert('Please fill in Media URL and select a linked product');
            return;
        }
        setIsSaving(true);

        try {
            const showcaseData = {
                media: convertDriveLink(showcaseForm.media || ''),
                mediaType: showcaseForm.mediaType || 'image',
                linkedProductId: showcaseForm.linkedProductId || '',
                title: showcaseForm.title || '',
                order: showcaseForm.order || 0,
            };

            if (editingShowcase) {
                await updateNewArrivalShowcase(editingShowcase.id, showcaseData);
            } else {
                await addNewArrivalShowcase(showcaseData as Omit<NewArrivalShowcase, 'id' | 'createdAt' | 'updatedAt'>);
            }

            // Refresh showcases only, no need to refetch products
            const updatedShowcases = await getNewArrivalShowcases();
            setShowcases(updatedShowcases);
            resetShowcaseForm();
        } catch (error) {
            console.error('Error saving showcase:', error);
            alert('Failed to save showcase. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteShowcase = async (id: string) => {
        if (confirm('Are you sure you want to delete this showcase?')) {
            try {
                await deleteNewArrivalShowcase(id);
                const updatedShowcases = await getNewArrivalShowcases();
                setShowcases(updatedShowcases);
            } catch (error) {
                console.error('Error deleting showcase:', error);
            }
        }
    };

    const handleEditShowcase = (showcase: NewArrivalShowcase) => {
        setEditingShowcase(showcase);
        setShowcaseForm(showcase);
        setIsAddingShowcase(true);
    };

    const resetShowcaseForm = () => {
        setEditingShowcase(null);
        setIsAddingShowcase(false);
        setShowcaseForm({
            media: '',
            mediaType: 'image',
            linkedProductId: '',
            title: '',
            order: showcases.length,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">New Arrivals Showcase</h2>
                    <p className="text-medium-gray mt-1">Create engaging visual stories linked to products</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadData} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => {
                            setShowcaseForm({ ...showcaseForm, order: showcases.length });
                            setIsAddingShowcase(true);
                        }}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Showcase
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {showcases.map((showcase) => {
                        const linkedProduct = products.find(p => p.id === showcase.linkedProductId);
                        return (
                            <div key={showcase.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative flex flex-col">
                                <div className="relative h-64 bg-gray-100">
                                    {showcase.mediaType === 'video' ? (
                                        <video
                                            src={showcase.media}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            // autoPlay // Can negatively impact performance in admin, maybe only hover?
                                            onMouseOver={(e) => e.currentTarget.play()}
                                            onMouseOut={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={showcase.media}
                                            alt={showcase.title || 'Showcase'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="400px"
                                        />
                                    )}
                                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${showcase.mediaType === 'video' ? 'bg-purple-500/80 text-white' : 'bg-blue-500/80 text-white'
                                        }`}>
                                        {showcase.mediaType === 'video' ? <span className="flex items-center gap-1"><Video size={12} /> Video</span> : <span className="flex items-center gap-1"><ImageIcon size={12} /> Image</span>}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">{showcase.title || linkedProduct?.name || 'Untitled'}</h3>
                                        {linkedProduct ? (
                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                                                    {linkedProduct.images[0] && <Image src={linkedProduct.images[0]} alt="" fill className="object-cover" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-medium-gray truncate">Linked Product</p>
                                                    <p className="text-sm font-medium text-charcoal truncate">{linkedProduct.name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-red-500 text-sm">Linked product not found</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                                        <span className="text-xs bg-gray-100 text-charcoal px-2 py-1 rounded">Order: {showcase.order}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditShowcase(showcase)} className="p-2 hover:bg-gold-primary/10 text-medium-gray hover:text-gold-primary rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteShowcase(showcase.id)} className="p-2 hover:bg-red-50 text-medium-gray hover:text-red-500 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showcases.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Sparkles size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-lg font-medium text-charcoal">No showcases yet</p>
                    <p className="text-medium-gray">Create visual highlights for your new arrivals.</p>
                </div>
            )}

            {/* Showcase Modal */}
            <AnimatePresence>
                {isAddingShowcase && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetShowcaseForm}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-playfair text-2xl font-bold text-charcoal">{editingShowcase ? 'Edit Showcase' : 'New Showcase'}</h3>
                                <button onClick={resetShowcaseForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-charcoal"><X size={24} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Media URL *</label>
                                    <input
                                        type="url"
                                        value={showcaseForm.media || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, media: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="Google Drive link"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Media Type</label>
                                    <div className="flex gap-4">
                                        {['image', 'video'].map((type) => (
                                            <label key={type} className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="hidden peer"
                                                    name="mediaType"
                                                    checked={showcaseForm.mediaType === type}
                                                    onChange={() => setShowcaseForm({ ...showcaseForm, mediaType: type as 'image' | 'video' })}
                                                />
                                                <div className="w-full p-3 bg-gray-50 peer-checked:bg-gold-primary/10 peer-checked:text-gold-primary peer-checked:border-gold-primary border border-transparent rounded-xl text-center capitalize font-medium transition-all">
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Linked Product *</label>
                                    <select
                                        value={showcaseForm.linkedProductId || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, linkedProductId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} ({productCategories.find(c => c.value === product.category)?.label})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={showcaseForm.title || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="Overrides product name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Order</label>
                                    <input
                                        type="number"
                                        value={showcaseForm.order || 0}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, order: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                                <button onClick={resetShowcaseForm} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-white transition-all">Cancel</button>
                                <button
                                    onClick={handleSaveShowcase}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gold-primary transition-all shadow-lg flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingShowcase ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
