'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const subcategories = [
    {
        name: "Women's Shawls",
        description: 'Luxurious pashmina, cashmere, and velvet shawls. Timeless elegance for every occasion.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574',
        href: '/women/shawls',
        featured: true,
    },
    {
        name: 'Duppattas',
        description: 'Exquisite organza, chiffon, and Banarasi silk duppattas. Add a touch of grace to any outfit.',
        image: 'https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787',
        href: '/women/duppattas',
        featured: false,
    },
];

export default function WomensCollectionPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-80 md:h-[28rem] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>
                <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white max-w-3xl"
                    >
                        <span className="inline-block px-5 py-2 bg-gold-primary/20 text-gold-light text-xs font-bold tracking-[0.25em] uppercase rounded-full mb-6 border border-gold-primary/30">
                            Explore Collection
                        </span>
                        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                            Women&apos;s Collection
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
                            Grace and elegance redefined. Luxurious shawls and exquisite duppattas for the modern woman.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Subcategories Grid */}
            <section className="container mx-auto px-4 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-gold-primary text-sm font-bold tracking-[0.2em] uppercase mb-3 block">
                        Browse Categories
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal">
                        Shop By Category
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {subcategories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={category.href} className="block group">
                                <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gold-light transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/70 text-sm md:text-base mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-gold-primary group-hover:gap-4 transition-all">
                                            <span className="text-sm font-medium">Explore Collection</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Featured Badge */}
                                    {category.featured && (
                                        <div className="absolute top-6 right-6">
                                            <span className="px-3 py-1 bg-gold-primary text-white text-xs font-bold rounded-full">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Brand Promise Section */}
            <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-6">
                            Designed for <span className="text-gold-primary">Elegance</span>
                        </h2>
                        <p className="text-medium-gray leading-relaxed mb-8">
                            Our women&apos;s collection celebrates femininity and grace. Each piece is carefully curated,
                            from the softest cashmere shawls to intricately crafted Banarasi silk duppattas.
                            Discover timeless beauty that complements your unique style.
                        </p>
                        <div className="grid grid-cols-3 gap-8">
                            <div className="text-center">
                                <span className="block font-playfair text-3xl text-gold-primary mb-2">100%</span>
                                <span className="text-medium-gray text-sm">Authentic</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-playfair text-3xl text-gold-primary mb-2">Hand</span>
                                <span className="text-medium-gray text-sm">Crafted</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-playfair text-3xl text-gold-primary mb-2">Premium</span>
                                <span className="text-medium-gray text-sm">Quality</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
