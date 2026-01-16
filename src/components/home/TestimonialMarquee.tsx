'use client';

import { motion, Variants } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const testimonials = [
    {
        id: 1,
        name: 'Hiba Shahid',
        location: 'Bahria Town, Lahore',
        quote: "Ordered the unstitched lawn suit. Yaar, the fabric is so soft! Quality is definitely 10/10. Will shop again for sure.",
        rating: 5,
    },
    {
        id: 2,
        name: 'Omar Farooq',
        location: 'F-11, Islamabad',
        quote: "Finally a brand that understands 'premium'. The fit of the Kurta is exactly what I was looking for. Highly recommended.",
        rating: 5,
    },
    {
        id: 3,
        name: 'Sana Malik',
        location: 'Clifton, Karachi',
        quote: "Delivery was super fast and the packaging basically feels like a gift. The shawl is just gorgeous!",
        rating: 5,
    },
    {
        id: 4,
        name: 'Usman Qureshi',
        location: 'PECHS, Karachi',
        quote: "Customer service is very responsive. Had a size issue initially but they exchanged it smoothly. Zabardast!",
        rating: 5,
    },
    {
        id: 5,
        name: 'Fatima Khan',
        location: 'Model Town, Lahore',
        quote: "Fragrance collection is mesmerizing. Lasting bohat achi hai. It smells so expensive but price is reasonable.",
        rating: 5,
    },
    {
        id: 6,
        name: 'Ali Raza',
        location: 'DHA, Lahore',
        quote: "Best shopping experience for men's eastern wear. The finish of the fabric is superior to other top brands.",
        rating: 5,
    },
    {
        id: 7,
        name: 'Rabia Hassan',
        location: 'Cantt, Rawalpindi',
        quote: "Was skeptical at first but the quality did justice. Real money for value.",
        rating: 5,
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

export function TestimonialMarquee() {
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
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <div key={`${t.id}-1-${i}`} className="flex-shrink-0 w-[300px] md:w-[420px]">
                                <ReviewCard review={t} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2 - Scroll Right */}
                <div className="flex overflow-hidden group">
                    <div className="flex gap-6 animate-scroll-right group-hover:pause-animation min-w-full px-3 transform-gpu">
                        {[...testimonials.reverse(), ...testimonials].map((t, i) => (
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

function ReviewCard({ review }: { review: typeof testimonials[0] }) {
    return (
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 hover:border-gold-primary/20 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={14} className="fill-gold-primary text-gold-primary" />
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-green-500 uppercase">
                        <CheckCircle size={10} /> Verified
                    </div>
                </div>
                <p className="text-white/80 text-sm md:text-base leading-relaxed italic mb-6">
                    "{review.quote}"
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white/50 font-bold text-sm">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">{review.name}</h4>
                    <p className="text-white/40 text-xs">{review.location}</p>
                </div>
            </div>
        </div>
    )
}
