'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FeaturedCollection } from '@/lib/types';
import { convertDriveLink } from '@/lib/utils';

// Default featured collections when database is empty
const defaultFeatured: FeaturedCollection[] = [
    {
        id: 'mens-shawls',
        title: "Men's Shawls",
        subtitle: 'Premium Pashmina',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800',
        href: '/men/shawls',
        span: 'large',
        order: 0,
    },
    {
        id: 'fragrances',
        title: 'Fragrances',
        subtitle: 'Signature Scents',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
        href: '/fragrances',
        span: 'medium',
        order: 1,
    },
    {
        id: 'ihram',
        title: 'Ihram',
        subtitle: 'Sacred Garments',
        image: 'https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=600',
        href: '/ihram',
        span: 'medium',
        order: 2,
    },
    {
        id: 'womens-shawls',
        title: "Women's Shawls",
        subtitle: 'Elegant Wraps',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
        href: '/women/shawls',
        span: 'large',
        order: 3,
    },
];

interface FeaturedCollectionsProps {
    collections?: FeaturedCollection[];
}

export function FeaturedCollections({ collections: propCollections }: FeaturedCollectionsProps) {
    const collections = propCollections && propCollections.length > 0 ? propCollections : defaultFeatured;

    // Get grid class based on span
    const getGridClass = (span: string) => {
        switch (span) {
            case 'large':
                return 'md:col-span-2 md:row-span-2';
            case 'medium':
                return 'md:col-span-1 md:row-span-2';
            case 'small':
            default:
                return 'md:col-span-1 md:row-span-1';
        }
    };

    // Get image height class based on span
    const getHeightClass = (span: string) => {
        switch (span) {
            case 'large':
                return 'h-[300px] md:h-full';
            case 'medium':
                return 'h-[250px] md:h-full';
            case 'small':
            default:
                return 'h-[200px] md:h-full';
        }
    };

    return (
        <section className="section bg-off-white py-20 md:py-28">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-gold-primary text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3 block">
                        Explore More
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
                        Featured Collections
                    </h2>
                    <div className="w-24 h-1 bg-gold-primary/20 mx-auto rounded-full" />
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[180px]">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group relative overflow-hidden rounded-2xl ${getGridClass(collection.span)}`}
                        >
                            <Link href={collection.href} className="block w-full h-full">
                                <div className={`relative w-full ${getHeightClass(collection.span)}`}>
                                    <Image
                                        src={convertDriveLink(collection.image)}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        {collection.subtitle && (
                                            <span className="text-xs font-medium tracking-wider uppercase text-gold-light opacity-90 mb-2 block">
                                                {collection.subtitle}
                                            </span>
                                        )}
                                        <h3 className="font-playfair text-xl md:text-2xl font-bold mb-2 group-hover:text-gold-light transition-colors">
                                            {collection.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span>Shop Now</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Hover Border */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-primary/50 rounded-2xl transition-colors duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
