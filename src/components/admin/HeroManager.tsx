'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';
import { getHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/lib/firestore';
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
    { value: '/men', label: "Men's (Overview)" },
    { value: '/women', label: "Women's (Overview)" },
    { value: '/fragrances', label: 'Fragrances (Overview)' },
    { value: '/ihram', label: 'Ihram (Overview)' },
];

export function HeroManager() {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingSlide, setIsAddingSlide] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

    const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: '',
        ctaLink: '',
        order: 0,
    });

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setIsLoading(true);
        try {
            const fetchedSlides = await getHeroSlides();
            setHeroSlides(fetchedSlides);
        } catch (error) {
            console.error('Error loading slides:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSlide = async () => {
        if (!slideForm.title || !slideForm.image) return;
        setIsSaving(true);

        try {
            const slideData = {
                title: slideForm.title || '',
                subtitle: slideForm.subtitle || '',
                description: slideForm.description || '',
                image: convertDriveLink(slideForm.image || ''),
                ctaText: slideForm.ctaText || '',
                ctaLink: slideForm.ctaLink || '',
                order: slideForm.order || 0,
            };

            if (editingSlide) {
                await updateHeroSlide(editingSlide.id, slideData);
            } else {
                await addHeroSlide(slideData);
            }

            await loadSlides();
            resetSlideForm();
        } catch (error) {
            console.error('Error saving slide:', error);
            alert('Failed to save slide. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            try {
                await deleteHeroSlide(id);
                loadSlides();
            } catch (error) {
                console.error('Error deleting slide:', error);
            }
        }
    };

    const handleEditSlide = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setSlideForm(slide);
        setIsAddingSlide(true);
    };

    const resetSlideForm = () => {
        setEditingSlide(null);
        setIsAddingSlide(false);
        setSlideForm({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            ctaText: '',
            ctaLink: '',
            order: heroSlides.length,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Hero Slides</h2>
                    <p className="text-medium-gray mt-1">Manage the main carousel on your homepage</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadSlides} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => {
                            setSlideForm({ ...slideForm, order: heroSlides.length });
                            setIsAddingSlide(true);
                        }}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Slide
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {heroSlides.map((slide) => (
                        <div key={slide.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="relative h-56">
                                <Image src={slide.image} alt={slide.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                    {slide.subtitle && <p className="text-xs font-bold tracking-widest uppercase text-gold-primary mb-1">{slide.subtitle}</p>}
                                    <h3 className="text-white font-playfair text-xl font-bold">{slide.title}</h3>
                                </div>
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-charcoal px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    Sequence: {slide.order + 1}
                                </span>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-medium-gray mb-4 line-clamp-2">{slide.description || 'No description provided.'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-xs font-medium text-charcoal bg-gray-100 px-2 py-1 rounded-md max-w-[120px] truncate">
                                        {slide.ctaLink || 'No link'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditSlide(slide)} className="p-2 hover:bg-gold-primary/10 text-medium-gray hover:text-gold-primary rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 hover:bg-red-50 text-medium-gray hover:text-red-500 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {heroSlides.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-lg font-medium text-charcoal">No slides active</p>
                    <p className="text-medium-gray">Add your first hero slide to welcome visitors.</p>
                </div>
            )}

            {/* Slide Modal */}
            <AnimatePresence>
                {isAddingSlide && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetSlideForm}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-playfair text-2xl font-bold text-charcoal">{editingSlide ? 'Edit Slide' : 'New Slide'}</h3>
                                <button onClick={resetSlideForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-charcoal"><X size={24} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Title *</label>
                                            <input
                                                value={slideForm.title || ''}
                                                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                                placeholder="e.g. Summer Collection"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Subtitle</label>
                                            <input
                                                value={slideForm.subtitle || ''}
                                                onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                                placeholder="e.g. New Arrivals"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-charcoal">Image URL *</label>
                                        <input
                                            value={slideForm.image || ''}
                                            onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                            placeholder="Google Drive link"
                                        />
                                        {slideForm.image && (
                                            <div className="relative mt-2 w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                                                <Image src={convertDriveLink(slideForm.image)} alt="Preview" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-charcoal">Description</label>
                                        <textarea
                                            value={slideForm.description || ''}
                                            onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Button Text</label>
                                            <input
                                                value={slideForm.ctaText || ''}
                                                onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                                placeholder="e.g. Shop Now"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Button Link</label>
                                            <select
                                                value={slideForm.ctaLink || ''}
                                                onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="">Select a page</option>
                                                {linkOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-charcoal">Order Priority</label>
                                        <input
                                            type="number"
                                            value={slideForm.order || 0}
                                            onChange={(e) => setSlideForm({ ...slideForm, order: Number(e.target.value) })}
                                            className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                                <button onClick={resetSlideForm} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-white transition-all">Cancel</button>
                                <button
                                    onClick={handleSaveSlide}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gold-primary transition-all shadow-lg flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingSlide ? 'Update Slide' : 'Create Slide'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
