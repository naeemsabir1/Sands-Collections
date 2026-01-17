'use client';

import { motion, Variants } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<number | null>(null); // null = all, 5 = 5 stars, etc.
    const [ratingStats, setRatingStats] = useState({
        average: 0,
        total: 0,
        breakdown: [
            { stars: 5, percentage: 0, count: 0 },
            { stars: 4, percentage: 0, count: 0 },
            { stars: 3, percentage: 0, count: 0 },
            { stars: 2, percentage: 0, count: 0 },
            { stars: 1, percentage: 0, count: 0 },
        ],
    });

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { getReviews } = await import('@/lib/firestore');
                const fetchedReviews = await getReviews();
                setReviews(fetchedReviews);

                // Calculate rating stats
                if (fetchedReviews.length > 0) {
                    const total = fetchedReviews.length;
                    const sum = fetchedReviews.reduce((acc, r) => acc + r.rating, 0);
                    const average = Math.round((sum / total) * 10) / 10;

                    const breakdown = [5, 4, 3, 2, 1].map(stars => {
                        const count = fetchedReviews.filter(r => r.rating === stars).length;
                        const percentage = Math.round((count / total) * 100);
                        return { stars, percentage, count };
                    });

                    setRatingStats({ average, total, breakdown });
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, []);

    // Filter reviews based on active filter
    const filteredReviews = activeFilter
        ? reviews.filter(r => r.rating === activeFilter)
        : reviews;

    // Get a featured review (first 5-star verified review)
    const featuredReview = reviews.find(r => r.rating === 5 && r.verified);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <section className="bg-white pt-10 pb-16 border-b border-gray-100 relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4"
                        >
                            What Our Customers Say
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-medium-gray text-lg"
                        >
                            Real stories from our valued community
                        </motion.p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gold-primary" />
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Overall Rating */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-cream/30 p-8 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center gap-8 border border-gold-primary/10"
                            >
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-charcoal font-playfair mb-2">{ratingStats.average}</div>
                                    <div className="flex gap-1 justify-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-6 h-6 fill-gold-primary text-gold-primary" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-medium-gray">{ratingStats.total.toLocaleString()} Reviews</p>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    {ratingStats.breakdown.map((item) => (
                                        <button
                                            key={item.stars}
                                            onClick={() => setActiveFilter(activeFilter === item.stars ? null : item.stars)}
                                            className={`w-full flex items-center gap-4 p-1 rounded-lg transition-colors ${activeFilter === item.stars ? 'bg-gold-primary/10' : 'hover:bg-gray-100'}`}
                                        >
                                            <div className="flex items-center gap-1 w-12 text-sm font-medium text-charcoal">
                                                {item.stars} <Star className="w-3 h-3 fill-charcoal text-charcoal" />
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${item.percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gold-primary rounded-full"
                                                />
                                            </div>
                                            <div className="w-10 text-xs text-medium-gray text-right">{item.percentage}%</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Featured Testimonial / Highlight */}
                            {featuredReview && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative p-8 bg-charcoal text-white rounded-3xl overflow-hidden shadow-xl"
                                >
                                    <div className="absolute top-0 right-0 p-32 bg-gold-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-1 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="w-4 h-4 fill-gold-primary text-gold-primary" />
                                            ))}
                                        </div>
                                        <p className="font-playfair text-xl md:text-2xl leading-relaxed italic mb-6">
                                            "{featuredReview.comment.length > 150 ? featuredReview.comment.slice(0, 150) + '...' : featuredReview.comment}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-lg">
                                                {featuredReview.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{featuredReview.userName}</p>
                                                <p className="text-white/60 text-sm">Verified Customer</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <h3 className="font-playfair text-2xl font-bold text-charcoal">
                        {activeFilter ? `${activeFilter} Star Reviews` : 'All Reviews'}
                        <span className="text-medium-gray font-normal text-lg ml-2">({filteredReviews.length})</span>
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                ${activeFilter === null
                                    ? 'bg-charcoal text-white shadow-lg'
                                    : 'bg-white text-medium-gray border border-gray-200 hover:border-gold-primary/50'}`}
                        >
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map(stars => (
                            <button
                                key={stars}
                                onClick={() => setActiveFilter(activeFilter === stars ? null : stars)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1
                                    ${activeFilter === stars
                                        ? 'bg-charcoal text-white shadow-lg'
                                        : 'bg-white text-medium-gray border border-gray-200 hover:border-gold-primary/50'}`}
                            >
                                {stars} <Star size={12} className="fill-current" />
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-gold-primary" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-medium-gray text-lg">No reviews found for this filter.</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {filteredReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                variants={itemVariants}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                            {review.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-charcoal text-sm">{review.userName}</h4>
                                            <div className="flex items-center gap-2 text-xs text-medium-gray">
                                                <span>{review.date}</span>
                                                {review.verified && (
                                                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                                        <CheckCircle size={10} /> Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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

                                {review.productName && (
                                    <p className="text-xs text-gold-primary mb-2 font-medium">Product: {review.productName}</p>
                                )}
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{review.comment}</p>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-medium-gray">
                                    <button className="flex items-center gap-1.5 hover:text-charcoal transition-colors">
                                        <ThumbsUp size={14} /> Helpful
                                    </button>
                                    <span>Share Review</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
}
