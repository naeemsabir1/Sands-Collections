'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '@/lib/types';
import { getReviews } from '@/lib/firestore';

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [activeRating, setActiveRating] = useState<number | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    useEffect(() => {
        if (activeRating === 'all') {
            setFilteredReviews(reviews);
        } else {
            setFilteredReviews(reviews.filter(r => r.rating === activeRating));
        }
    }, [activeRating, reviews]);

    const loadReviews = async () => {
        setIsLoading(true);
        const data = await getReviews(productId);
        setReviews(data);
        setFilteredReviews(data);
        setIsLoading(false);
    };

    const ratingCounts = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';

    if (isLoading) {
        return <div className="py-12 text-center text-medium-gray animate-pulse">Loading reviews...</div>;
    }

    return (
        <div id="reviews-section" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm scroll-mt-24">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-8">Customer Reviews</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                {/* Summary Section */}
                <div className="text-center lg:text-left space-y-4">
                    <div className="flex items-end justify-center lg:justify-start gap-3">
                        <span className="text-6xl font-playfair font-bold text-charcoal">{averageRating}</span>
                        <div className="pb-2 text-gold-primary flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} className="fill-gold-primary" />
                            ))}
                        </div>
                    </div>
                    <p className="text-medium-gray text-lg">Based on {totalReviews} reviews</p>
                </div>

                {/* Rating Bars - Interactive */}
                <div className="lg:col-span-2 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingCounts[rating as keyof typeof ratingCounts];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        const isSelected = activeRating === rating;

                        return (
                            <button
                                key={rating}
                                onClick={() => setActiveRating(isSelected ? 'all' : rating)}
                                className={`w-full group flex items-center gap-4 text-sm transition-all duration-300 ${isSelected ? 'opacity-100 scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <span className={`font-bold w-3 ${isSelected ? 'text-gold-primary' : 'text-charcoal'}`}>{rating}</span>
                                <Star size={14} className={`${isSelected ? 'text-gold-primary fill-gold-primary' : 'text-gray-300'}`} />
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className={`h-full rounded-full transition-colors ${isSelected ? 'bg-gold-primary' : 'bg-charcoal'}`}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                                <span className={`w-10 text-right ${isSelected ? 'font-bold text-charcoal' : 'text-medium-gray'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter Reset */}
            {activeRating !== 'all' && (
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setActiveRating('all')}
                        className="text-sm text-gold-primary hover:text-charcoal transition-colors flex items-center gap-1 font-medium"
                    >
                        <Filter size={14} /> Reset Filter
                    </button>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-gold-primary/20 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-charcoal">{review.userName}</span>
                                            {review.verified && (
                                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                    <CheckCircle size={10} /> Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-medium-gray">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={`${i < review.rating ? 'fill-gold-primary text-gold-primary' : 'fill-gray-200 text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-medium-gray flex gap-4">
                                    <button className="flex items-center gap-1 hover:text-charcoal transition-colors">
                                        <ThumbsUp size={12} /> Helpful
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-medium-gray bg-gray-50 rounded-2xl border border-dashed border-gray-200"
                        >
                            No reviews match this filter.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
