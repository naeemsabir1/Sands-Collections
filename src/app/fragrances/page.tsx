'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const subcategories = [
    {
        name: "Men's Fragrances",
        description: 'Bold and sophisticated scents. From intense oud to fresh aquatics for the modern man.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104',
        href: '/fragrances/mens',
        gradient: 'from-slate-900 to-slate-700',
    },
    {
        name: "Women's Fragrances",
        description: 'Romantic and seductive scents. Delicate florals, elegant roses, and captivating orchids.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104',
        href: '/fragrances/womens',
        gradient: 'from-rose-900 to-pink-700',
    },
    {
        name: 'Unisex Fragrances',
        description: 'Sophisticated scents that transcend gender. Warm ambers, rich ouds, and clean musks.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104',
        href: '/fragrances/unisex',
        gradient: 'from-amber-900 to-yellow-700',
    },
];

export default function FragrancesPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-80 md:h-[28rem] overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-gold-primary/30 rounded-full"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 3) * 20}%`,
                            }}
                            animate={{
                                y: [-20, 20, -20],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>

                <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white max-w-3xl"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2 bg-gold-primary/20 text-gold-light text-xs font-bold tracking-[0.25em] uppercase rounded-full mb-6 border border-gold-primary/30"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles size={14} />
                            Fragrance House
                        </motion.div>
                        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                            Signature Scents
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
                            Discover your perfect fragrance. From bold Arabian ouds to romantic florals.
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
                        Explore Scents
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal">
                        Shop By Category
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {subcategories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={category.href} className="block group">
                                <div className={`relative h-96 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br ${category.gradient}`}>
                                    <div className="absolute inset-0 opacity-30">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="font-playfair text-2xl font-bold text-white mb-2 group-hover:text-gold-light transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/70 text-sm mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-gold-primary group-hover:gap-4 transition-all">
                                            <span className="text-sm font-medium">Explore Scents</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-primary/30 rounded-3xl transition-colors duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Fragrance Notes Section */}
            <section className="bg-charcoal py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="font-playfair text-3xl md:text-4xl text-white mb-6">
                            Scent <span className="text-gold-primary">Profiles</span>
                        </h2>
                        <p className="text-white/70 leading-relaxed mb-12">
                            Our fragrances are crafted with the finest ingredients from around the world.
                            Each scent tells a unique story through carefully balanced notes.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { name: 'Oud', description: 'Rich & Woody' },
                                { name: 'Rose', description: 'Romantic & Elegant' },
                                { name: 'Musk', description: 'Clean & Sensual' },
                                { name: 'Amber', description: 'Warm & Inviting' },
                            ].map((note) => (
                                <div key={note.name} className="text-center p-6 border border-white/10 rounded-2xl hover:border-gold-primary/30 transition-colors">
                                    <span className="block font-playfair text-xl text-gold-primary mb-1">{note.name}</span>
                                    <span className="text-white/50 text-sm">{note.description}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
