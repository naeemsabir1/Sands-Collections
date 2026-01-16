'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CuratedCategory } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';

// Default categories when database is empty
const defaultCategories: CuratedCategory[] = [
    {
        id: '1',
        name: "Men's Shawls",
        href: '/men/shawls',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=200&h=200&fit=crop',
        description: 'Premium Pashmina',
        order: 0,
    },
    {
        id: '2',
        name: "Men's Suiting",
        href: '/men/unstitched-suiting',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200&h=200&fit=crop',
        description: 'Fine Fabrics',
        order: 1,
    },
    {
        id: '3',
        name: "Women's Shawls",
        href: '/women/shawls',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200&h=200&fit=crop',
        description: 'Elegant Wraps',
        order: 2,
    },
    {
        id: '4',
        name: "Duppattas",
        href: '/women/duppattas',
        image: 'https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=200&h=200&fit=crop',
        description: 'Luxurious Designs',
        order: 3,
    },
    {
        id: '5',
        name: 'Fragrances',
        href: '/fragrances',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&h=200&fit=crop',
        description: 'Signature Scents',
        order: 4,
    },
    {
        id: '6',
        name: 'Ihram',
        href: '/ihram',
        image: 'https://images.unsplash.com/photo-1598018552394-3c72633d4546?q=80&w=200&h=200&fit=crop',
        description: 'Sacred Garments',
        order: 5,
    },
];

interface CategoryBarProps {
    categories?: CuratedCategory[];
}

export function CategoryBar({ categories: propCategories }: CategoryBarProps) {
    const categories = propCategories && propCategories.length > 0 ? propCategories : defaultCategories;
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="relative py-12 md:py-20 bg-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-50/50 via-white to-white pointer-events-none" />

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-gold-primary text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3 block">
                        Our Collections
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
                        Curated Categories
                    </h2>
                    <div className="w-24 h-1 bg-gold-primary/20 mx-auto rounded-full" />
                </motion.div>

                {/* Horizontal Scroll Container with Navigation */}
                <div className="relative">
                    {/* Navigation Arrows - Desktop */}
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-charcoal hover:bg-gold-primary hover:text-white transition-all duration-300 hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-charcoal hover:bg-gold-primary hover:text-white transition-all duration-300 hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Scrollable Categories */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-4 -mx-4 md:px-8 md:-mx-8"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="flex-shrink-0 w-[180px] md:w-[220px] snap-center"
                            >
                                <Link href={category.href} className="block group">
                                    <div className="relative glass-panel-premium p-5 md:p-6 rounded-2xl border border-gray-100/50 hover:border-gold-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-primary/5 flex flex-col items-center text-center group-hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="relative w-20 h-20 md:w-28 md:h-28 mb-5 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:shadow-gold-primary/20 transition-all duration-500">
                                            <Image
                                                src={convertDriveLink(category.image)}
                                                alt={category.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                sizes="(max-width: 768px) 80px, 112px"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </div>

                                        {/* Category Name */}
                                        <h3 className="font-playfair text-base md:text-lg font-medium text-charcoal mb-1 group-hover:text-gold-primary transition-colors duration-300">
                                            {category.name}
                                        </h3>

                                        {/* Description */}
                                        {category.description && (
                                            <p className="text-xs md:text-sm text-medium-gray/80 font-light tracking-wide group-hover:text-charcoal/70 transition-colors">
                                                {category.description}
                                            </p>
                                        )}

                                        {/* Hover Arrow */}
                                        <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-gold-primary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14m-7-7 7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile scroll indicator */}
                <div className="flex justify-center gap-2 mt-6 md:hidden">
                    <span className="text-xs text-medium-gray">Swipe to explore</span>
                    <ChevronRight size={14} className="text-medium-gray animate-pulse" />
                </div>
            </div>
        </section>
    );
}
