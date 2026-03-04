'use client';

import { motion, Variants } from 'framer-motion';
import { Star, ArrowRight, Quote, ShieldCheck } from 'lucide-react';
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
                        .slice(0, 10) // Limit for exclusivity
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

    // Double the array for seamless infinite scrolling
    const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="bg-[#050505] py-16 md:py-20 overflow-hidden relative">
            {/* Ambient Lighting & Noise */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF77]/20 to-transparent" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />

            {/* Soft Radial Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF77]/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 mb-12 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF77]/20 bg-[#D4AF77]/5 backdrop-blur-md mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF77] opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF77]/80"></span>
                        </span>
                        <span className="text-[8px] md:text-[9px] font-medium tracking-[0.3em] text-[#D4AF77] uppercase mt-0.5">
                            Trusted by Thousands
                        </span>
                    </div>

                    <h2 className="font-sans text-2xl md:text-4xl font-light tracking-tight text-white mb-3">
                        Words from our <span className="font-playfair text-[#D4AF77] italic tracking-normal">Community</span>
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF77]/50 to-transparent mt-4" />
                </motion.div>
            </div>

            {/* Premium Marquee Container */}
            <div className="relative flex overflow-hidden group py-6">
                {/* Harsh edge masks for the cinematic fade-out effect */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-56 z-20 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-56 z-20 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

                <div className="flex gap-4 md:gap-6 animate-scroll-left group-hover:pause-animation min-w-full px-4 transform-gpu select-none">
                    {marqueeItems.map((t, i) => (
                        <div key={`${t.id}-${i}`} className="flex-shrink-0 w-[280px] md:w-[380px]">
                            <ReviewCard review={t} />
                        </div>
                    ))}
                </div>
            </div>

            {/* See All Button */}
            <div className="text-center mt-12 relative z-10 flex justify-center">
                <Link href="/reviews">
                    <button className="group relative inline-flex items-center justify-center px-6 py-3 bg-transparent text-[#D4AF77] font-medium tracking-widest uppercase text-[10px] md:text-xs overflow-hidden transition-all duration-500 rounded-none border border-[#D4AF77]/30 hover:border-[#D4AF77]">
                        <span className="absolute inset-0 w-full h-full bg-[#D4AF77]/5 group-hover:bg-[#D4AF77]/10 transition-colors duration-500" />
                        <span className="relative z-10 flex items-center gap-3 tracking-[0.15em]">
                            View All Reviews
                            <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </button>
                </Link>
            </div>
        </section>
    );
}

function ReviewCard({ review }: { review: TestimonialItem }) {
    return (
        <div className="relative bg-gradient-to-br from-[#121212] to-[#0A0A0A] p-6 md:p-8 rounded-sm border border-white/[0.03] hover:border-[#D4AF77]/[0.15] transition-all duration-500 h-full min-h-[220px] flex flex-col justify-between group overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

            {/* Background Decorative Quote Mark */}
            <Quote className="absolute -top-2 -right-2 w-16 h-16 text-white/[0.02] transform -rotate-12 group-hover:scale-110 group-hover:text-[#D4AF77]/[0.03] transition-all duration-700 pointer-events-none" />

            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex gap-1.5 mb-5 md:mb-6">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star
                            key={s}
                            size={10}
                            strokeWidth={1}
                            className={s <= review.rating ? "fill-[#D4AF77] text-[#D4AF77]" : "fill-white/10 text-white/10"}
                        />
                    ))}
                </div>

                {/* Review Text */}
                <p className="font-playfair text-white/[0.85] text-base md:text-lg leading-[1.6] italic font-light drop-shadow-md pb-4">
                    "{review.comment}"
                </p>
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#D4AF77]/30 bg-[#0A0A0A] flex items-center justify-center text-[#D4AF77] font-sans font-light text-xs shadow-[0_0_15px_rgba(212,175,119,0.1)]">
                            {review.userName.charAt(0).toUpperCase()}
                        </div>
                        {/* Name & Title */}
                        <div className="flex flex-col">
                            <h4 className="text-white/90 font-sans tracking-wide text-xs md:text-[13px] font-medium">
                                {review.userName}
                            </h4>
                            <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-0.5">Verified</p>
                        </div>
                    </div>

                    {/* Golden Verification Badge */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF77]/10 text-[#D4AF77]">
                        <ShieldCheck size={12} strokeWidth={1.5} />
                    </div>
                </div>
            </div>
        </div>
    )
}
