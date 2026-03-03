'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, Star, RefreshCw, Plus, Pencil, X, Save, Loader2 } from 'lucide-react';
import { Review, Product } from '@/lib/types';
import { getReviews, deleteReview, addReview, updateReview, getProducts, seedReviews } from '@/lib/firestore';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewFormData {
    productId: string;
    productName: string;
    userName: string;
    rating: number;
    comment: string;
    verified: boolean;
}

const initialFormData: ReviewFormData = {
    productId: '',
    productName: '',
    userName: '',
    rating: 5,
    comment: '',
    verified: true
};

export function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);

    // Advanced Actions State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        loadReviews();
        loadProducts();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredReviews(reviews);
        } else {
            const lower = searchQuery.toLowerCase();
            setFilteredReviews(reviews.filter(r =>
                r.userName.toLowerCase().includes(lower) ||
                r.comment.toLowerCase().includes(lower) ||
                (r.productName || '').toLowerCase().includes(lower)
            ));
        }
    }, [searchQuery, reviews]);

    const loadReviews = async () => {
        setIsLoading(true);
        const data = await getReviews();
        setReviews(data);
        setFilteredReviews(data);
        setIsLoading(false);
    };

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    const openAddModal = () => {
        setFormData(initialFormData);
        setModalMode('add');
        setEditingReviewId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (review: Review) => {
        setFormData({
            productId: review.productId,
            productName: review.productName || '',
            userName: review.userName,
            rating: review.rating,
            comment: review.comment,
            verified: review.verified
        });
        setModalMode('edit');
        setEditingReviewId(review.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormData);
        setEditingReviewId(null);
    };

    const handleProductChange = (productId: string) => {
        const product = products.find(p => p.id === productId);
        setFormData(prev => ({
            ...prev,
            productId,
            productName: product?.name || ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.userName || !formData.comment) {
            alert('Please fill all required fields');
            return;
        }

        setIsSaving(true);

        if (modalMode === 'add') {
            const newReviewId = await addReview({
                productId: formData.productId,
                productName: formData.productName,
                userName: formData.userName,
                rating: formData.rating,
                comment: formData.comment,
                verified: formData.verified,
                date: new Date().toISOString().split('T')[0]
            });

            if (newReviewId) {
                await loadReviews();
                closeModal();
            } else {
                alert('Failed to add review. Please try again.');
            }
        } else if (modalMode === 'edit' && editingReviewId) {
            const success = await updateReview(editingReviewId, {
                productId: formData.productId,
                productName: formData.productName,
                userName: formData.userName,
                rating: formData.rating,
                comment: formData.comment,
                verified: formData.verified
            });

            if (success) {
                await loadReviews();
                closeModal();
            } else {
                alert('Failed to update review. Please try again.');
            }
        }

        setIsSaving(false);
    };

    const renderStars = (rating: number, onClick?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(r => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => onClick?.(r)}
                        className={`${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            size={20}
                            className={r <= rating ? 'fill-gold-primary text-gold-primary' : 'text-gray-300'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Reviews Management</h2>
                    <p className="text-medium-gray mt-1">Monitor and manage customer feedback</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadReviews} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm" title="Refresh Reviews">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg bg-charcoal text-white hover:bg-black transition-all font-medium"
                    >
                        <Plus size={20} />
                        Add Review
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by customer, comment, or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all shadow-sm"
                />
            </div>

            {/* Reviews List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                        <div className="flex gap-0.5 bg-gray-50 px-2 py-1 rounded-lg">
                                            <span className="font-bold text-sm text-charcoal mr-1">{review.rating}</span>
                                            <Star size={14} className="fill-gold-primary text-gold-primary" />
                                        </div>
                                        <span className="font-bold text-charcoal">{review.userName}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-sm text-medium-gray truncate max-w-[200px]">{review.productName || 'Product ID: ' + review.productId}</span>
                                        {review.verified && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 italic">"{review.comment}"</p>
                                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(review)}
                                        className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit Review"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Review"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                            No reviews found.
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-playfair font-bold text-charcoal">
                                    {modalMode === 'add' ? 'Add New Review' : 'Edit Review'}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Product Select */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Product *</label>
                                    <select
                                        value={formData.productId}
                                        onChange={(e) => handleProductChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Customer Name *</label>
                                    <input
                                        type="text"
                                        value={formData.userName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                                        placeholder="Enter customer name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Rating *</label>
                                    {renderStars(formData.rating, (r) => setFormData(prev => ({ ...prev, rating: r })))}
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Review Comment *</label>
                                    <textarea
                                        value={formData.comment}
                                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Enter review comment..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all resize-none"
                                        required
                                    />
                                </div>

                                {/* Verified Checkbox */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="verified"
                                        checked={formData.verified}
                                        onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                                        className="w-5 h-5 rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
                                    />
                                    <label htmlFor="verified" className="text-sm text-charcoal">Verified Purchase</label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-charcoal hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-charcoal text-white hover:bg-black transition-colors font-medium disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                {modalMode === 'add' ? 'Add Review' : 'Save Changes'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Advanced Actions Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-medium-gray hover:text-charcoal transition-colors"
                >
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Advanced Actions
                </button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Database size={20} className="text-amber-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-amber-800">Regenerate All Reviews</h4>
                                        <p className="text-sm text-amber-700 mt-1">
                                            This will DELETE all existing reviews and generate 124 new reviews with random Pakistani names and authentic comments in Roman Urdu & Urdu script.
                                        </p>
                                        <button
                                            onClick={async () => {
                                                if (confirm('⚠️ WARNING: This will DELETE ALL existing reviews and generate 124 new ones.\n\nThis action cannot be undone. Continue?')) {
                                                    setIsSeeding(true);
                                                    const success = await seedReviews();
                                                    setIsSeeding(false);
                                                    if (success) {
                                                        alert('✅ Success! 124 reviews have been generated with random Pakistani names.');
                                                        loadReviews();
                                                    } else {
                                                        alert('❌ Seeding failed. Please check the console for errors.');
                                                    }
                                                }
                                            }}
                                            disabled={isSeeding}
                                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {isSeeding ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Generating Reviews...
                                                </>
                                            ) : (
                                                <>
                                                    <Database size={16} />
                                                    Regenerate Reviews
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
