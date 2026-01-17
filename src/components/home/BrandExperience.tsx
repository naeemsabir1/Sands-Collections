'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
        },
    },
};

export function BrandExperience() {
    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-cream via-white to-cream relative overflow-hidden">
            {/* Static decorative accents (no infinite animations) */}
            <div className="absolute top-20 left-[10%] w-20 h-20 border border-gold-primary/10 rounded-full opacity-50" />
            <div className="absolute bottom-32 right-[15%] w-12 h-12 bg-gold-primary/5 rounded-lg opacity-50" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Main Content */}
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    {/* Animated tagline */}
                    <motion.span
                        className="inline-block text-gold-primary text-sm font-medium tracking-[0.3em] uppercase mb-6"
                        variants={itemVariants}
                    >
                        Experience The Difference
                    </motion.span>

                    {/* Luxury heading with word-by-word animation */}
                    <motion.h2
                        className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-6 leading-tight"
                        variants={itemVariants}
                    >
                        Where Tradition Meets
                        <motion.span
                            className="block text-gold-primary mt-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Modern Elegance
                        </motion.span>
                    </motion.h2>

                    <motion.p
                        className="text-medium-gray mb-12 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                        variants={itemVariants}
                    >
                        Crafted with passion, designed for distinction. Every piece in our collection
                        tells a story of heritage, quality, and uncompromising style.
                    </motion.p>

                    {/* Stats row with animated counters */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-14"
                        variants={containerVariants}
                    >
                        {[
                            { value: '5000+', label: 'Happy Customers' },
                            { value: '200+', label: 'Premium Designs' },
                            { value: '100%', label: 'Quality Assured' },
                            { value: '4.8/5', label: 'Customer Rating' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="group"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    className="bg-white/80 backdrop-blur-sm border border-charcoal/5 rounded-2xl p-6 
                             shadow-[0_4px_20px_rgba(0,0,0,0.03)] 
                             group-hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]
                             group-hover:border-gold-primary/20 transition-all duration-500"
                                >
                                    <motion.span
                                        className="block font-playfair text-2xl md:text-3xl font-bold text-charcoal mb-1
                               group-hover:text-gold-primary transition-colors duration-300"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 100 }}
                                        viewport={{ once: true }}
                                    >
                                        {stat.value}
                                    </motion.span>
                                    <span className="text-xs md:text-sm text-medium-gray uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* WhatsApp CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center mt-8"
                    >
                        <motion.a
                            href="https://wa.me/923334944293"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white font-medium rounded-full
                         hover:bg-gold-primary transition-all duration-300 group min-w-[280px] justify-center
                         shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg
                                className="w-5 h-5 group-hover:scale-110 transition-transform"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span>Chat on WhatsApp</span>
                        </motion.a>
                    </motion.div>

                </motion.div>
            </div>

            {/* Bottom decorative line */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-primary to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
            />
        </section>
    );
}
