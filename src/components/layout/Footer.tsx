'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
    Instagram,
    Phone,
    Mail,
    Star,
    Truck,
    CreditCard,
    RotateCcw,
    Shield,
    LucideIcon
} from 'lucide-react';

const policyFeatures: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders above PKR 5,000' },
    { icon: CreditCard, title: 'Cash on Delivery', description: 'Pay when you receive' },
    { icon: RotateCcw, title: 'Easy Returns', description: '7-day return policy' },
    { icon: Shield, title: 'Premium Quality', description: 'Finest materials only' },
];

const policyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const policyItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
};

const iconFloatVariants = {
    initial: { y: 0 },
    animate: {
        y: [-2, 2, -2],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
};

const footerLinks = {
    shop: [
        { name: "Men's Shawls", href: '/men/shawls' },
        { name: "Men's Suiting", href: '/men/unstitched-suiting' },
        { name: "Women's Shawls", href: '/women/shawls' },
        { name: "Duppattas", href: '/women/duppattas' },
        { name: "Fragrances", href: '/fragrances' },
        { name: 'Ihram Collection', href: '/ihram' },
    ],
    support: [
        { name: 'Shipping Policy', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQs', href: '/faqs' },
    ],
    company: [
        { name: 'Our Heritage', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
    ],
};

const WHATSAPP_NUMBER = '+923334944293';

const testimonialsRow1 = [
    {
        name: "Hiba Shahid",
        location: "Bahria Town, Lahore",
        text: "Ordered the unstitched lawn suit. Yaar, the fabric is so soft! Quality is definitely 10/10. Will shop again for sure.",
        stars: 5
    },
    {
        name: "Omar Farooq",
        location: "F-11, Islamabad",
        text: "Finally a brand that understands 'premium'. The fit of the Kurta is exactly what I was looking for. Highly recommended.",
        stars: 5
    },
    {
        name: "Sana Mir",
        location: "Clifton, Karachi",
        text: "Delivery was super fast. Kapray bohat achay hain, especially the embroidery details. Loved the packaging too! ✨",
        stars: 5
    },
    {
        name: "Zainab Ali",
        location: "DHA, Multan",
        text: "Simply love it! The color didn't fade after washing. Paisay puray ho gaye. Best online shopping experience so far.",
        stars: 5
    },
];

const testimonialsRow2 = [
    {
        name: "Bilal Ahmed",
        location: "Gulberg, Lahore",
        text: "Bought a shalwar kameez for dad. He loved the comfort. Bohat ala quality hai. Keep it up Sands!",
        stars: 5
    },
    {
        name: "Fatima Khan",
        location: "Model Town, Lahore",
        text: "Fragrance collection is mesmerizing. Lasting bohat achi hai. It smells so expensive but price is reasonable.",
        stars: 5
    },
    {
        name: "Usman Qureshi",
        location: "PECHS, Karachi",
        text: "Customer service is very responsive. Had a size issue initially but they exchanged it smoothly. Zabardast!",
        stars: 5
    },
    {
        name: "Rabia Hassan",
        location: "Cantt, Rawalpindi",
        text: "Was skeptical at first, but wow. The pictures don't do justice. Real mein colors aur bhi pyaray hain.",
        stars: 5
    },
];

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="relative mt-32 pt-20 pb-10 overflow-hidden bg-[#0a0a0a]">
            {/* 1. Background Visuals - Creative Depth */}
            <div className="absolute inset-0 z-0">
                {/* Massive Watermark Typography */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none opacity-[0.03]">
                    <span className="font-playfair text-[20vw] font-bold text-white leading-none whitespace-nowrap">
                        SANDS
                    </span>
                </div>

                {/* Ambient Orbs */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* 1. Policy/Features Banner (Home Only - Merged) */}
                {pathname === '/' && (
                    <div className="mb-20 border-b border-white/[0.08] pb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={policyContainerVariants}
                            className="max-w-7xl mx-auto"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                                {policyFeatures.map((feature, index) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            className="text-center group cursor-default"
                                            variants={policyItemVariants}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <motion.div
                                                className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center relative
                                                         group-hover:bg-gold-primary/20 transition-colors duration-300
                                                         group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-sm border border-white/10"
                                                variants={iconFloatVariants}
                                                initial="initial"
                                                animate="animate"
                                                style={{ animationDelay: `${index * 0.5}s` }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-gold-primary/0 group-hover:border-gold-primary/30"
                                                    initial={{ scale: 1, opacity: 0 }}
                                                    whileHover={{ scale: 1.3, opacity: 1 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                <IconComponent
                                                    size={24}
                                                    className="text-gold-light group-hover:text-gold-primary transition-colors duration-300"
                                                />
                                            </motion.div>
                                            <motion.h3
                                                className="font-medium text-white text-sm md:text-base mb-1 group-hover:text-gold-light transition-colors duration-300 font-playfair tracking-wide"
                                            >
                                                {feature.title}
                                            </motion.h3>
                                            <motion.p
                                                className="text-xs md:text-sm text-white/50 group-hover:text-white/80 transition-colors duration-300"
                                            >
                                                {feature.description}
                                            </motion.p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 3. Main Footer Grid - Creative Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20 border-t border-white/[0.08] pt-16">

                    {/* Brand Section (4 Cols) */}
                    <div className="md:col-span-4 lg:col-span-5 space-y-8 pr-8">
                        <Link href="/" className="inline-block">
                            <h2 className="font-playfair text-3xl text-white">
                                SANDS <span className="text-gold-primary text-lg align-top">•</span>
                            </h2>
                        </Link>
                        <p className="text-white/50 font-light leading-relaxed max-w-sm">
                            Defining the standard of Pakistani luxury. Each piece is a testament to timeless elegance and superior craftsmanship.
                        </p>

                        {/* Glass Social Pills */}
                        <div className="flex flex-wrap gap-3">
                            <SocialPill icon={Instagram} label="Instagram" href="https://www.instagram.com/sands_collections_official" />
                        </div>
                    </div>

                    {/* Links Grid (7 Cols - Split into columns) */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-medium mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-primary"></span>
                                Collections
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/50 hover:text-white hover:translate-x-2 transition-all duration-300 block text-sm">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                                Support
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/50 hover:text-white hover:translate-x-2 transition-all duration-300 block text-sm">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/[0.08] pt-8 md:pt-0 md:pl-8 mt-8 md:mt-0">
                            <h4 className="text-gold-primary font-medium mb-6">Contact</h4>
                            <ul className="space-y-6">
                                <li className="flex gap-4 group cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                                        <Phone size={16} className="text-white group-hover:text-gold-primary transition-colors" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Call Us</p>
                                        <a href="tel:+923334944293" className="text-white group-hover:text-gold-primary transition-colors text-sm whitespace-nowrap">0333-4944293</a>
                                    </div>
                                </li>
                                <li className="flex gap-4 group cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                                        <Mail size={16} className="text-white group-hover:text-gold-primary transition-colors" />
                                    </div>
                                    <div className="min-w-0 overflow-hidden">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
                                        <a href="mailto:sandsclothingofficial@gmail.com" className="text-white group-hover:text-gold-primary transition-colors text-xs truncate block" title="sandsclothingofficial@gmail.com">sandsclothingofficial@gmail.com</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Glass Bar */}
                <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs font-light">
                        © 2026 Sands Collections. Made with perfection.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-wider">Privacy</Link>
                        <span className="text-white/10">•</span>
                        <Link href="/terms" className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-wider">Terms</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}

function ReviewCard({ review }: { review: any }) {
    return (
        <div className="w-[300px] md:w-[400px] flex-shrink-0 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                    {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} size={14} className="fill-gold-primary text-gold-primary" />
                    ))}
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Verified</span>
                </div>
            </div>

            <p className="text-white/80 font-light text-sm leading-relaxed mb-6 italic">
                "{review.text}"
            </p>

            <div className="flex items-center gap-3 border-t border-white/[0.05] pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white font-serif font-bold text-sm border border-white/10">
                    {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-sm font-medium group-hover:text-gold-primary transition-colors">{review.name}</span>
                    <span className="text-white/40 text-xs">{review.location}</span>
                </div>
            </div>
        </div>
    )
}

function SocialPill({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
    return (
        <a
            href={href}
            className="flex items-center gap-2 pl-3 pr-4 py-2 bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.08] rounded-full transition-all group"
        >
            <Icon size={14} className="text-white/60 group-hover:text-gold-primary transition-colors" />
            <span className="text-xs text-white/60 group-hover:text-white transition-colors">{label}</span>
        </a>
    )
}
