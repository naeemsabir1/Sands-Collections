'use client';

import { motion, Variants } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Review } from '@/lib/types';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

// Fallback testimonials in case DB is empty
const fallbackTestimonials = [
    {
        id: '1',
        userName: 'Hiba Shahid',
        comment: "Ordered the unstitched lawn suit. Yaar, the fabric is so soft! Quality is definitely 10/10. Will shop again for sure.",
        rating: 5,
    },
    {
        id: '2',
        userName: 'Omar Farooq',
        comment: "Finally a brand that understands 'premium'. The fit of the Kurta is exactly what I was looking for. Highly recommended.",
        rating: 5,
    },
    {
        id: '3',
        userName: 'Sana Malik',
        comment: "Delivery was super fast and the packaging basically feels like a gift. The shawl is just gorgeous!",
        rating: 5,
    },
    {
        id: '4',
        userName: 'Fatima Khan',
        comment: "Fragrance collection is mesmerizing. Lasting bohat achi hai. It smells so expensive but price is reasonable.",
        rating: 5,
    },
];

interface TestimonialItem {
    id: string;
    userName: string;
    comment: string;
    rating: number;
}

export function TestimonialMarquee() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>(fallbackTestimonials);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { getReviews } = await import('@/lib/firestore');
                const reviews = await getReviews();

                if (reviews && reviews.length > 0) {
                    // Take top reviews (4-5 stars) for the marquee
                    const topReviews = reviews
                        .filter((r: Review) => r.rating >= 4)
                        .slice(0, 14) // Get enough for two rows
                        .map((r: Review) => ({
                            id: r.id,
                            userName: r.userName,
                            comment: r.comment,
                            rating: r.rating,
                        }));

                    if (topReviews.length > 0) {
                        setTestimonials(topReviews);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch reviews for marquee:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, []);

    // Split testimonials into two rows
    const midPoint = Math.ceil(testimonials.length / 2);
    const row1 = testimonials.slice(0, midPoint);
    const row2 = testimonials.slice(midPoint);

    return (
        <section className="bg-[#111111] py-20 overflow-hidden relative">
            {/* Ambient Gradient Background */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 mb-12 relative z-10 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-gold-primary/30 bg-gold-primary/10 backdrop-blur-md mb-6">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gold-primary uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                            Trusted by Thousands
                        </span>
                    </div>

                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-4">
                        Words from our <span className="text-gold-primary italic">Community</span>
                    </h2>
                </motion.div>
            </div>

            {/* Marquee Container - Two Rows */}
            <div className="relative flex flex-col gap-8 md:gap-10">
                {/* Gradient Masks - Enhanced */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 z-10 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 z-10 bg-gradient-to-l from-[#111111] via-[#111111]/80 to-transparent pointer-events-none" />

                {/* Row 1 - Scroll Left */}
                <div className="flex overflow-hidden group">
                    <div className="flex gap-6 animate-scroll-left group-hover:pause-animation min-w-full px-3 transform-gpu">
                        {[...row1, ...row1].map((t, i) => (
                            <div key={`${t.id}-1-${i}`} className="flex-shrink-0 w-[300px] md:w-[420px]">
                                <ReviewCard review={t} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2 - Scroll Right */}
                <div className="flex overflow-hidden group">
                    <div className="flex gap-6 animate-scroll-right group-hover:pause-animation min-w-full px-3 transform-gpu">
                        {[...row2, ...row2].map((t, i) => (
                            <div key={`${t.id}-2-${i}`} className="flex-shrink-0 w-[300px] md:w-[420px]">
                                <ReviewCard review={t} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* See All Button */}
            <div className="text-center mt-12 relative z-10">
                <Link href="/reviews">
                    <button className="group relative px-8 py-3 bg-white text-charcoal font-medium rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <span className="relative z-10 flex items-center gap-2">
                            View All Reviews <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </Link>
            </div>
        </section>
    );
}

function ReviewCard({ review }: { review: TestimonialItem }) {
    return (
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 hover:border-gold-primary/20 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star
                                key={s}
                                size={14}
                                className={s <= review.rating ? "fill-gold-primary text-gold-primary" : "fill-gray-600 text-gray-600"}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-green-500 uppercase">
                        <CheckCircle size={10} /> Verified
                    </div>
                </div>
                <p className="text-white/80 text-sm md:text-base leading-relaxed italic mb-6">
                    "{review.comment}"
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white/50 font-bold text-sm">
                    {review.userName.charAt(0)}
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">{review.userName}</h4>
                    <p className="text-white/40 text-xs">Verified Customer</p>
                </div>
            </div>
        </div>
    )
}
