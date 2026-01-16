'use client';

import { motion, Variants } from 'framer-motion';
import { Truck, CreditCard, RotateCcw, Shield, LucideIcon } from 'lucide-react';

const features: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders above PKR 5,000' },
    { icon: CreditCard, title: 'Cash on Delivery', description: 'Pay when you receive' },
    { icon: RotateCcw, title: 'Easy Returns', description: '7-day return policy' },
    { icon: Shield, title: 'Premium Quality', description: 'Finest materials only' },
];

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

const iconFloatVariants: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-2, 2, -2],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export function PolicyBanner() {
    return (
        <section className="py-16 md:py-20 bg-charcoal overflow-hidden relative">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <motion.div
                className="container mx-auto px-4 lg:px-8 relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                className="text-center text-white group cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <motion.div
                                    className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center relative
                             group-hover:bg-gold-primary/20 transition-colors duration-300
                             group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-sm"
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
                                    className="font-medium text-sm md:text-base mb-1 group-hover:text-gold-light transition-colors duration-300 font-playfair tracking-wide"
                                >
                                    {feature.title}
                                </motion.h3>
                                <motion.p
                                    className="text-xs md:text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300"
                                >
                                    {feature.description}
                                </motion.p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
