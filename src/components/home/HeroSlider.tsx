'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGES = [
    '/hero image 1.webp',
    '/hero image 2.webp',
    '/hero image 3.webp',
    '/hero image 4.png'
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Rotate image every 3.5 seconds for a smooth, elegant feel
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    // Animation variants - Optimized
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-[#0F0F0F] -mt-20 md:-mt-24">
            {/* Cinematic Background with Crossfade */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 origin-center"
                >
                    <Image
                        src={HERO_IMAGES[currentIndex]}
                        alt={`Sands Collections Hero ${currentIndex + 1}`}
                        fill
                        className="object-cover object-center"
                        priority={currentIndex === 0}
                        quality={90}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Dark gradient overlay (Optimized for performance) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 z-0 pointer-events-none" />

            {/* Content Container - Perfect Centering */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 md:px-12 pt-16">
                {isMounted && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto flex flex-col items-center"
                    >
                        {/* Headline */}
                        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
                            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-wide shadow-black drop-shadow-xl">
                                <span className="text-white">Crafting </span>
                                <span className="text-[#D4AF77] italic font-light">Timeless</span>
                                <span className="text-white"> Elegance</span>
                            </h1>
                        </motion.div>

                        {/* Subheadline */}
                        <motion.h2
                            variants={itemVariants}
                            className="text-xs sm:text-sm md:text-base text-[#FFFDD0]/90 font-light tracking-wider mb-5 md:mb-8 drop-shadow-lg px-4"
                        >
                            Premium Shawls • Elegant Gents Suiting • Exquisite Fragrances
                        </motion.h2>

                        {/* Tagline */}
                        <motion.p
                            variants={itemVariants}
                            className="text-[9px] sm:text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-white/80 mb-10 md:mb-12 drop-shadow-sm"
                        >
                            Where Heritage Meets Modern Luxury
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/products"
                                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#D4AF77] text-black font-semibold uppercase tracking-widest text-xs md:text-sm overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] rounded-none z-10"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop the Collection
                                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                                {/* Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer z-0" />
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* Scroll Down Arrow */}
            {isMounted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-light hidden md:block">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[#D4AF77]"
                    >
                        <ArrowDown size={18} strokeWidth={1} />
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
