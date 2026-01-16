'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSlide } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';

// Default slides when database is empty
const defaultSlides: HeroSlide[] = [
    {
        id: '1',
        title: "Spring '26 Collection",
        subtitle: 'Golden Hour',
        description: 'Discover our exclusive range of premium Pakistani fashion',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=2070',
        ctaText: 'Explore Now',
        ctaLink: '/women',
        order: 0,
    },
    {
        id: '2',
        title: 'Luxury Fragrances',
        subtitle: 'Signature Scents',
        description: 'Find your perfect fragrance from our curated collection',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104',
        ctaText: 'Shop Fragrances',
        ctaLink: '/fragrances',
        order: 1,
    },
    {
        id: '3',
        title: "Men's Collection",
        subtitle: 'Premium Fabrics',
        description: 'Timeless elegance meets modern craftsmanship',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
        ctaText: 'View Collection',
        ctaLink: '/men',
        order: 2,
    },
];

interface HeroSliderProps {
    slides?: HeroSlide[];
    isLoading?: boolean;
}

export function HeroSlider({ slides: propSlides, isLoading = false }: HeroSliderProps) {
    // Use Firebase slides when available, otherwise defaults immediately (no waiting)
    const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    // Only show counter after Firebase data has loaded (prevents 03→06 jump)
    const [showCounter, setShowCounter] = useState(false);

    // Reset to first slide when slides data changes and show counter once stable
    useEffect(() => {
        setCurrentIndex(0);
        // If propSlides has data, show the counter
        if (propSlides && propSlides.length > 0) {
            setShowCounter(true);
        }
    }, [propSlides?.length]);

    const slideNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const slidePrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(slideNext, 8000);
        return () => clearInterval(timer);
    }, [slideNext]);

    const currentSlide = slides[currentIndex];

    // Animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 1.2,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 1,
        }),
    };

    return (
        <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-charcoal -mt-32 md:-mt-36">
            {/* Background Slides */}
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.8 },
                        scale: { duration: 10, ease: "linear" }
                    }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background Image */}
                    <div className="relative w-full h-full will-change-transform">
                        <Image
                            src={convertDriveLink(currentSlide.image)}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent sm:via-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative z-10 h-full container mx-auto px-6 lg:px-12 flex items-center">
                <div className="max-w-4xl pt-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`content-${currentIndex}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Subtitle - Glass Badge */}
                            {currentSlide.subtitle && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-panel-premium border-gold-primary/30"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                                    <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-gold-light">
                                        {currentSlide.subtitle}
                                    </span>
                                </motion.div>
                            )}

                            {/* Title - God Tier Typography */}
                            <motion.div className="overflow-hidden mb-6">
                                <motion.h1
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                                    className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-white tracking-tight"
                                >
                                    {currentSlide.title.split(" ").map((word, i) => (
                                        <span key={i} className="inline-block mr-4">
                                            {i === 1 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-amber-600 italic">{word}</span> : word}
                                        </span>
                                    ))}
                                </motion.h1>
                            </motion.div>

                            {/* Description */}
                            {currentSlide.description && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-light"
                                >
                                    {currentSlide.description}
                                </motion.p>
                            )}

                            {/* CTA Buttons */}
                            {currentSlide.ctaLink && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Link
                                        href={currentSlide.ctaLink}
                                        className="parametric-btn group relative px-8 py-4 bg-white text-charcoal font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {currentSlide.ctaText || 'Shop Collection'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gold-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out -z-0" />
                                        <span className="absolute inset-0 z-10 border border-white/0 group-hover:border-white/20 rounded-full transition-colors" />
                                    </Link>

                                    <Link
                                        href="/about"
                                        className="group px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                                    >
                                        Our Story
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Controls - Glass & Minimal */}
            <div className="absolute bottom-12 right-8 md:right-16 flex items-center gap-4 z-20">
                <div className={`flex items-center gap-1 mr-4 transition-opacity duration-500 ${showCounter ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-3xl font-playfair font-bold text-white">
                        {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white/40 text-lg">/</span>
                    <span className="text-white/40 text-lg">
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={slidePrev}
                        className="w-14 h-14 rounded-full glass-panel-premium flex items-center justify-center text-white hover:bg-white hover:text-charcoal transition-all duration-500 hover:scale-110 active:scale-95 group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={slideNext}
                        className="w-14 h-14 rounded-full glass-panel-premium flex items-center justify-center text-white hover:bg-white hover:text-charcoal transition-all duration-500 hover:scale-110 active:scale-95 group"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                    key={currentIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-gold-primary"
                />
            </div>
        </section>
    );
}
