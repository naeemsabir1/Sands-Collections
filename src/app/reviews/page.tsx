'use client';

import { motion, Variants } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle, User, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

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

// Mock Data
const ratingStats = {
    average: 4.8,
    total: 5243,
    breakdown: [
        { stars: 5, percentage: 85, count: 4456 },
        { stars: 4, percentage: 10, count: 524 },
        { stars: 3, percentage: 3, count: 157 },
        { stars: 2, percentage: 1, count: 52 },
        { stars: 1, percentage: 1, count: 54 },
    ],
};

const reviews = [
    {
        id: 1,
        name: 'Sarah A.',
        date: '2 days ago',
        rating: 5,
        verified: true,
        title: 'Absolutely stunning quality!',
        content: 'The Pashmina shawl I ordered is beyond beautiful. The material is so soft and the color is exactly as shown. Delivery was super fast too!',
        likes: 12,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    },
    {
        id: 2,
        name: 'Hassan K.',
        date: '1 week ago',
        rating: 5,
        verified: true,
        title: 'Premium feel, worth every penny',
        content: 'Ordered the Arabian Oud Intense. The fragrance lasts all day and smells incredibly luxurious. Will definitely be a returning customer.',
        likes: 8,
        image: null,
    },
    {
        id: 3,
        name: 'Ayesha M.',
        date: '3 weeks ago',
        rating: 4,
        verified: true,
        title: 'Great products, delivery slightly delayed',
        content: 'The unstitched suits are of premium quality. Just wish the delivery was a bit faster, but the support team was very helpful and responsive.',
        likes: 24,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',
    },
    {
        id: 4,
        name: 'Bilal R.',
        date: '1 month ago',
        rating: 5,
        verified: true,
        title: 'Best Ihram set I have found',
        content: 'Perfect cotton quality for the summer heat. Very comfortable and breathable. Highly recommended for anyone going for Umrah.',
        likes: 15,
        image: null,
    },
    {
        id: 5,
        name: 'Zainab F.',
        date: '1 month ago',
        rating: 5,
        verified: true,
        title: 'Elegant packaging',
        content: 'The unboxing experience itself feels so premium. The product was wrapped beautifully. Love the attention to detail Sands Collections puts in.',
        likes: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    },
    {
        id: 6,
        name: 'Omer T.',
        date: '2 months ago',
        rating: 5,
        verified: true,
        title: 'My go-to for gifts',
        content: 'Whenever I need a classy gift, I come here. The shawls and perfumes are always a hit. Keep up the great work!',
        likes: 9,
        image: null,
    },
];

export default function ReviewsPage() {
    const [activeFilter, setActiveFilter] = useState('All Reviews');

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
                                    <div key={item.stars} className="flex items-center gap-4">
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
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Featured Testimonial / Highlight */}
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
                                    "I've never seen such attention to detail in packaging and fabric quality. Sands Collections truly delivers a luxury experience."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-lg">
                                        M
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Maria Khan</p>
                                        <p className="text-white/60 text-sm">Loyal Customer since 2024</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <h3 className="font-playfair text-2xl font-bold text-charcoal">Latest Reviews</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['All Reviews', 'With Images', '5 Stars', 'Verified Purchase'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                    ${activeFilter === filter
                                        ? 'bg-charcoal text-white shadow-lg'
                                        : 'bg-white text-medium-gray border border-gray-200 hover:border-gold-primary/50'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {review.image ? (
                                        <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-charcoal text-sm">{review.name}</h4>
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

                            <h5 className="font-bold text-gray-900 mb-2">{review.title}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{review.content}</p>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-medium-gray">
                                <button className="flex items-center gap-1.5 hover:text-charcoal transition-colors">
                                    <ThumbsUp size={14} /> Helpful ({review.likes})
                                </button>
                                <span>Share Review</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-12 text-center">
                    <button className="btn-outline px-8 py-3 rounded-full hover:bg-gold-primary hover:text-white hover:border-gold-primary">
                        Load More Reviews
                    </button>
                </div>
            </section>
        </div>
    );
}
