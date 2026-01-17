'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search, Star, Loader2, RefreshCw, Database } from 'lucide-react';
import { Review } from '@/lib/types';
import { getReviews, deleteReview, seedReviews, getProducts } from '@/lib/firestore'; // Assuming getReviews can be updated to fetch all if no ID passed, or we fetch per product. 
// Actually firestore.ts getReviews currently filters by productId. I need to update it or iterate. 
// For admin, fetching ALL is better. I'll modify firestore.ts slightly or just fetch for all products here? 
// Fetching all reviews in one query is better. I will assume I can update getReviews to be optional productId.
// Wait, I updated getReviews to take optional productId in previous step. So getReviews() should return all. Correct.

export function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        loadReviews();
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
        // getReviews() with no arg returns all because I implemented "if (productId) constraints.push"
        const data = await getReviews();
        setReviews(data);
        setFilteredReviews(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    const handleSeed = async () => {
        if (confirm('WARNING: This will DELETE ALL existing reviews and generate 124 new Roman Urdu reviews. Continue?')) {
            setIsSeeding(true);
            const success = await seedReviews();
            setIsSeeding(false);
            if (success) {
                alert('Success! 124 Reviews generated.');
                loadReviews();
            } else {
                alert('Seeding failed. Check console.');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Reviews Management</h2>
                    <p className="text-medium-gray mt-1">Monitor and manage customer feedback</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadReviews} className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium bg-charcoal text-white hover:bg-black border-none"
                    >
                        {isSeeding ? <Loader2 size={20} className="animate-spin" /> : <Database size={20} />}
                        {isSeeding ? 'Generating...' : 'Regenerate Seed Data'}
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
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="flex gap-0.5 bg-gray-50 px-2 py-1 rounded-lg">
                                            <span className="font-bold text-sm text-charcoal mr-1">{review.rating}</span>
                                            <Star size={14} className="fill-gold-primary text-gold-primary" />
                                        </div>
                                        <span className="font-bold text-charcoal">{review.userName}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-sm text-medium-gray truncate max-w-[200px]">{review.productName || 'Product ID: ' + review.productId}</span>
                                    </div>
                                    <p className="text-gray-600 italic">"{review.comment}"</p>
                                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center">
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
                            No reviews found. Try matching criteria or Seed Data.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
