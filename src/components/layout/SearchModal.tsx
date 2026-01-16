'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Sample products for search (will be replaced with Firebase)
const allProducts: Product[] = [
    { id: 'ms-1', name: 'Pure Pashmina Shawl - Charcoal', description: '', price: 18500, images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070'], category: 'mens-shawls', inStock: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'mu-1', name: 'Premium Wool Suiting', description: '', price: 12500, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080'], category: 'mens-unstitched-suiting', inStock: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'ws-1', name: 'Pashmina Shawl - Rose Pink', description: '', price: 16500, images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574'], category: 'womens-shawls', inStock: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'wd-1', name: 'Organza Duppatta - Coral', description: '', price: 4500, images: ['https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787'], category: 'womens-duppattas', inStock: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'frag-1', name: 'Arabian Oud Intense', description: '', price: 8500, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'], category: 'fragrances-mens', inStock: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'ihram-1', name: 'Premium Cotton Ihram Set', description: '', price: 2500, images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'], category: 'ihram-gents', inStock: true, createdAt: new Date(), updatedAt: new Date() },
];

const quickLinks = [
    { name: "Men's Shawls", href: '/men/shawls' },
    { name: "Unstitched Suiting", href: '/men/unstitched-suiting' },
    { name: "Women's Shawls", href: '/women/shawls' },
    { name: "Duppattas", href: '/women/duppattas' },
    { name: 'Fragrances', href: '/fragrances' },
    { name: 'Ihram', href: '/ihram' },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim()) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100]"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Search Container */}
                    <div className="relative h-full flex items-start justify-center pt-24 md:pt-32 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Search Input */}
                            <div className="flex items-center px-5 py-4 border-b border-gray-100">
                                <Search size={20} className="text-gold-primary mr-4 flex-shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="flex-1 bg-transparent text-base text-charcoal placeholder:text-medium-gray focus:outline-none"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-medium-gray hover:text-charcoal transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {query.trim() && results.length > 0 && (
                                    <div className="p-4">
                                        <p className="text-xs text-medium-gray mb-3 uppercase tracking-wider">
                                            {results.length} Result{results.length !== 1 ? 's' : ''}
                                        </p>
                                        <div className="space-y-1">
                                            {results.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
                                                >
                                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-charcoal text-sm truncate">{product.name}</p>
                                                        <p className="text-xs text-medium-gray">{product.category.replace('-', ' ')}</p>
                                                    </div>
                                                    <p className="font-semibold text-charcoal text-sm">{formatPrice(product.price)}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {query.trim() && results.length === 0 && (
                                    <div className="p-8 text-center">
                                        <p className="text-medium-gray text-sm">No products found for &quot;{query}&quot;</p>
                                    </div>
                                )}

                                {/* Quick Links - shown when no query */}
                                {!query.trim() && (
                                    <div className="p-5">
                                        <p className="text-xs text-medium-gray mb-4 uppercase tracking-wider">
                                            Popular Categories
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {quickLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={onClose}
                                                    className="px-4 py-2 bg-cream rounded-full text-sm text-charcoal hover:bg-gold-primary hover:text-white transition-colors"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>

                                        <Link
                                            href="/men"
                                            onClick={onClose}
                                            className="flex items-center justify-between p-4 bg-cream rounded-xl hover:bg-gold-primary/10 transition-colors group"
                                        >
                                            <span className="font-medium text-charcoal text-sm">Browse All Products</span>
                                            <ArrowRight size={16} className="text-gold-primary group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
