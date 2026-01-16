'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const subcategories = [
    {
        name: 'Ladies Ihram',
        description: 'Comfortable and modest Ihram sets for ladies. Designed for your spiritual journey with maximum comfort.',
        image: 'https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574',
        href: '/ihram/ladies',
    },
    {
        name: 'Gents Ihram',
        description: 'Pure and comfortable traditional two-piece Ihram sets for men. Premium fabrics for Hajj and Umrah.',
        image: 'https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574',
        href: '/ihram/gents',
    },
];

export default function IhramPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-80 md:h-[28rem] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574)',
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
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold tracking-[0.25em] uppercase rounded-full mb-6 border border-white/20"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Star size={14} className="text-gold-light" />
                            Sacred Garments
                        </motion.div>
                        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                            Ihram Collection
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
                            Pure, comfortable, and permissible Ihrams for your spiritual journey. Hajj and Umrah essentials.
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
                        Browse Collection
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
                                <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-stone-100 to-stone-200">
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
                                            <span className="text-sm font-medium">View Collection</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Hover border effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-primary/30 rounded-3xl transition-colors duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Information Section */}
            <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-6">
                            Prepared for Your <span className="text-gold-primary">Journey</span>
                        </h2>
                        <p className="text-medium-gray leading-relaxed mb-12">
                            Our Ihram collection is designed with your spiritual journey in mind. We use only the finest,
                            permissible materials that meet all requirements while ensuring maximum comfort during your pilgrimage.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { title: 'Pure White', desc: 'Traditional Colors' },
                                { title: 'Breathable', desc: 'Premium Fabrics' },
                                { title: 'Comfortable', desc: 'All-Day Wear' },
                                { title: 'Permissible', desc: 'Hajj Approved' },
                            ].map((item) => (
                                <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                                    <span className="block font-playfair text-lg text-charcoal mb-1">{item.title}</span>
                                    <span className="text-medium-gray text-sm">{item.desc}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
