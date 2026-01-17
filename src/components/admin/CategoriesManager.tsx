'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, RefreshCw, Layout } from 'lucide-react';
import { CuratedCategory } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';
import { getCuratedCategories, addCuratedCategory, updateCuratedCategory, deleteCuratedCategory } from '@/lib/firestore';
import Image from 'next/image';

const linkOptions = [
    { value: '/men/shawls', label: "Men's Shawls" },
    { value: '/men/unstitched-suiting', label: "Men's Unstitched Suiting" },
    { value: '/women/shawls', label: "Women's Shawls" },
    { value: '/women/duppattas', label: "Duppattas" },
    { value: '/fragrances/mens', label: 'Fragrances - Mens' },
    { value: '/fragrances/womens', label: 'Fragrances - Womens' },
    { value: '/fragrances/unisex', label: 'Fragrances - Unisex' },
    { value: '/ihram/ladies', label: 'Ladies Ihram' },
    { value: '/ihram/gents', label: 'Gents Ihram' },
];

export function CategoriesManager() {
    const [categories, setCategories] = useState<CuratedCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CuratedCategory | null>(null);

    const [categoryForm, setCategoryForm] = useState<Partial<CuratedCategory>>({
        name: '',
        description: '',
        image: '',
        href: '/men/shawls',
        order: 0,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const fetchedCategories = await getCuratedCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCategory = async () => {
        if (!categoryForm.name || !categoryForm.image || !categoryForm.href) {
            alert('Please fill in all required fields (Name, Image, Category Link)');
            return;
        }
        setIsSaving(true);

        try {
            const categoryData = {
                name: categoryForm.name || '',
                description: categoryForm.description || '',
                image: convertDriveLink(categoryForm.image || ''),
                href: categoryForm.href || '/men/shawls',
                order: categoryForm.order || 0,
            };

            if (editingCategory) {
                await updateCuratedCategory(editingCategory.id, categoryData);
            } else {
                await addCuratedCategory(categoryData);
            }

            await loadCategories();
            resetCategoryForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCuratedCategory(id);
                loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleEditCategory = (category: CuratedCategory) => {
        setEditingCategory(category);
        setCategoryForm(category);
        setIsAddingCategory(true);
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setIsAddingCategory(false);
        setCategoryForm({
            name: '',
            description: '',
            image: '',
            href: '/men/shawls',
            order: categories.length,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Curated Categories</h2>
                    <p className="text-medium-gray mt-1">Manage horizontal scrolling categories on homepage</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadCategories} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => {
                            setCategoryForm({ ...categoryForm, order: categories.length });
                            setIsAddingCategory(true);
                        }}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Category
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                            <div className="relative h-40">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h4 className="text-white font-bold truncate w-full">{cat.name}</h4>
                                </div>
                                <span className="absolute top-2 right-2 bg-white/90 text-charcoal w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                                    {cat.order + 1}
                                </span>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-medium-gray truncate mb-3">{cat.description || 'No description'}</p>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditCategory(cat)} className="p-1.5 hover:bg-gold-primary/10 text-medium-gray hover:text-gold-primary rounded transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 hover:bg-red-50 text-medium-gray hover:text-red-500 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full truncate max-w-[80px]">
                                        {cat.href}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {categories.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Layout size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-lg font-medium text-charcoal">No categories found</p>
                </div>
            )}

            {/* Category Modal */}
            <AnimatePresence>
                {isAddingCategory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetCategoryForm}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-playfair text-2xl font-bold text-charcoal">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                                <button onClick={resetCategoryForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-charcoal"><X size={24} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Category Name *</label>
                                    <input
                                        value={categoryForm.name || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="e.g. Men's Shawls"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Description</label>
                                    <input
                                        value={categoryForm.description || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="Brief subtitle"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Image URL *</label>
                                    <input
                                        value={categoryForm.image || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        placeholder="Google Drive link"
                                    />
                                    {categoryForm.image && (
                                        <div className="relative mt-2 w-full h-32 rounded-xl overflow-hidden bg-gray-100">
                                            <Image src={convertDriveLink(categoryForm.image)} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Link *</label>
                                    <select
                                        value={categoryForm.href || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, href: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select page...</option>
                                        {linkOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-charcoal">Order</label>
                                    <input
                                        type="number"
                                        value={categoryForm.order || 0}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                                <button onClick={resetCategoryForm} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-white transition-all">Cancel</button>
                                <button
                                    onClick={handleSaveCategory}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gold-primary transition-all shadow-lg flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
