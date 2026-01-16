'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NewArrivalShowcase, Product } from '@/lib/types';
import { getNewArrivalShowcases, getProducts } from '@/lib/firestore';

// Default placeholder showcases when database is empty
const defaultShowcases: (Omit<NewArrivalShowcase, 'createdAt' | 'updatedAt'> & { placeholderProductName: string })[] = [
    {
        id: 'placeholder-1',
        media: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Premium Pashmina Collection',
        order: 1,
        placeholderProductName: 'Pure Pashmina Shawl',
    },
    {
        id: 'placeholder-2',
        media: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Elegant Shawls',
        order: 2,
        placeholderProductName: 'Royal Merino Shawl',
    },
    {
        id: 'placeholder-3',
        media: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Exclusive Fragrances',
        order: 3,
        placeholderProductName: 'Arabian Oud Intense',
    },
    {
        id: 'placeholder-4',
        media: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Suiting Collection',
        order: 4,
        placeholderProductName: 'Premium Wool Suiting',
    },
    {
        id: 'placeholder-5',
        media: 'https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Dupatta Collection',
        order: 5,
        placeholderProductName: 'Organza Duppatta',
    },
    {
        id: 'placeholder-6',
        media: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000',
        mediaType: 'image',
        linkedProductId: '',
        title: 'Women\'s Shawls',
        order: 6,
        placeholderProductName: 'Rose Pink Pashmina',
    },
];

export function NewArrivals() {
    const [showcases, setShowcases] = useState<NewArrivalShowcase[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [fetchedShowcases, fetchedProducts] = await Promise.all([
                    getNewArrivalShowcases(),
                    getProducts(),
                ]);
                setShowcases(fetchedShowcases);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error loading showcases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 340;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Get linked product name
    const getProductName = (productId: string) => {
        const product = products.find(p => p.id === productId);
        return product?.name || 'View Product';
    };

    // Determine what to display
    const displayItems = showcases.length > 0 ? showcases : [];
    const showPlaceholders = !isLoading && displayItems.length === 0;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header - Static (no animations to prevent scroll jump) */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="inline-block text-gold-primary text-sm font-medium tracking-widest uppercase mb-2">
                            Fresh Styles
                        </span>
                        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-charcoal">
                            New Arrivals
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Navigation Buttons */}
                        <div className="hidden md:flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-white transition-all duration-300"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-white transition-all duration-300"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Showcase Carousel */}
                <div className="relative -mx-4 px-4">
                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                    >
                        {/* Loading skeleton */}
                        {isLoading && (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex-shrink-0 w-[300px] md:w-[320px] snap-start">
                                        <div className="relative aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Real showcases from Firebase */}
                        {!isLoading && displayItems.map((showcase) => (
                            <div key={showcase.id} className="flex-shrink-0 w-[300px] md:w-[320px] snap-start group">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                                    {/* Media */}
                                    {showcase.mediaType === 'video' ? (
                                        <video
                                            src={showcase.media}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            playsInline
                                            autoPlay
                                        />
                                    ) : (
                                        <Image
                                            src={showcase.media}
                                            alt={showcase.title || 'New Arrival'}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 300px, 320px"
                                        />
                                    )}

                                    {/* Video indicator */}
                                    {showcase.mediaType === 'video' && (
                                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                            <Play size={12} className="text-white fill-white" />
                                            <span className="text-white text-xs font-medium">Video</span>
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        {showcase.title && (
                                            <h3 className="text-white font-medium text-lg mb-1">
                                                {showcase.title}
                                            </h3>
                                        )}
                                        <p className="text-white/70 text-sm mb-4">
                                            {getProductName(showcase.linkedProductId)}
                                        </p>

                                        {/* Go to Product Button */}
                                        <Link
                                            href={`/products/${showcase.linkedProductId}`}
                                            className="inline-flex items-center gap-2 bg-white text-charcoal px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gold-primary hover:text-white transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100"
                                        >
                                            Go to Product <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Placeholder showcases when empty */}
                        {showPlaceholders && defaultShowcases.map((placeholder) => (
                            <div key={placeholder.id} className="flex-shrink-0 w-[300px] md:w-[320px] snap-start group">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                                    <Image
                                        src={placeholder.media}
                                        alt={placeholder.title || 'New Arrival'}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 300px, 320px"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-white font-medium text-lg mb-1">
                                            {placeholder.title}
                                        </h3>
                                        <p className="text-white/70 text-sm mb-4">
                                            {placeholder.placeholderProductName}
                                        </p>

                                        {/* Placeholder Button */}
                                        <button
                                            className="inline-flex items-center gap-2 bg-white text-charcoal px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gold-primary hover:text-white transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100"
                                        >
                                            Go to Product <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile scroll hint */}
                <div className="mt-6 text-center md:hidden">
                    <p className="text-sm text-medium-gray">Swipe to see more →</p>
                </div>
            </div>
        </section>
    );
}
