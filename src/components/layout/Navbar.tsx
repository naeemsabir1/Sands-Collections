'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ShoppingBag,
    Search,
    Heart,
    ChevronDown,
    User
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchModal } from './SearchModal';

const categories = [
    {
        name: "Men's",
        href: '/men',
        submenu: [
            { name: 'Shawls', href: '/men/shawls' },
            { name: 'Unstitched Suiting', href: '/men/unstitched-suiting' },
        ],
    },
    {
        name: "Women's",
        href: '/women',
        submenu: [
            { name: 'Shawls', href: '/women/shawls' },
            { name: 'Duppattas', href: '/women/duppattas' },
        ],
    },
    {
        name: 'Fragrances',
        href: '/fragrances',
        submenu: [
            { name: 'Mens', href: '/fragrances/mens' },
            { name: 'Womens', href: '/fragrances/womens' },
            { name: 'Unisex', href: '/fragrances/unisex' },
        ],
    },
    {
        name: 'Ihram',
        href: '/ihram',
        submenu: [
            { name: 'Ladies', href: '/ihram/ladies' },
            { name: 'Gents', href: '/ihram/gents' },
        ],
    },
    {
        name: 'Reviews',
        href: '/reviews',
    },
    {
        name: 'Contact Us',
        href: '/contact',
    },
];

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasMounted, setHasMounted] = useState(false); // Hydration fix
    const { state: cartState } = useCart();
    const { state: wishlistState } = useWishlist();

    // Handle scroll for navbar styling
    // Handle scroll for navbar styling
    useEffect(() => {
        setHasMounted(true); // Mark as mounted to enable client-only rendering

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide navbar on admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <>
            {/* Announcement Bar - Slim & Premium */}
            <div className="bg-charcoal text-white text-center py-2 px-4 relative z-50">
                <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase animate-pulse">
                    Free Shipping on Orders Above PKR 5,000
                </p>
            </div>

            {/* Floating Glass Island Navbar */}
            <header className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] w-[95%] max-w-7xl ${isScrolled
                ? 'top-4 rounded-full glass-island py-3 shadow-2xl bg-white/90 border-white/40'
                : 'top-12 rounded-2xl bg-white/50 backdrop-blur-md border-white/20 py-5'
                }`}>
                <nav className="px-6 md:px-8">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button - Magnetic */}
                        <button
                            className="lg:hidden p-2 -ml-2 text-charcoal hover:text-gold-primary transition-colors hover:scale-110 active:scale-95"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        {/* Logo - Animated Reveal */}
                        <Link href="/" className="flex-shrink-0 group relative overflow-hidden">
                            <h1 className="font-playfair text-xl md:text-2xl font-bold tracking-tight">
                                <span className="text-charcoal group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-charcoal group-hover:to-gold-dark transition-all duration-500">SANDS</span>
                                <span className="text-gold-primary ml-1.5 group-hover:text-gold-dark transition-colors duration-500">COLLECTIONS</span>
                            </h1>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </Link>

                        {/* Desktop Navigation - Clean & Spaced */}
                        <div className="hidden lg:flex items-center gap-8">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(category.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={category.href}
                                        className="flex items-center gap-1.5 py-2 text-[0.9375rem] font-medium text-charcoal hover:text-black transition-colors relative"
                                    >
                                        <span className="relative z-10">{category.name}</span>
                                        {/* Hover Underline Animation */}
                                        <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-gold-primary group-hover:w-full transition-all duration-300 ease-out" />

                                        {category.submenu && (
                                            <ChevronDown
                                                size={12}
                                                className={`transition-transform duration-300 text-charcoal/60 ${activeDropdown === category.name ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        )}
                                    </Link>

                                    {/* Glass Dropdown */}
                                    {category.submenu && (
                                        <AnimatePresence>
                                            {activeDropdown === category.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-max"
                                                >
                                                    <div className="min-w-[200px] glass-panel-premium rounded-2xl overflow-hidden p-2 shadow-2xl">
                                                        {category.submenu.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block px-4 py-3 text-sm font-medium text-charcoal hover:bg-gold-primary/10 hover:text-gold-dark rounded-xl transition-all duration-200 hover:pl-5"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Icons - Floating Magnetic */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 active:scale-95 transition-all duration-300 group"
                                aria-label="Search"
                            >
                                <Search size={20} strokeWidth={1.5} className="text-charcoal group-hover:text-gold-dark transition-colors" />
                            </button>

                            <Link
                                href="/wishlist"
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 active:scale-95 transition-all duration-300 group relative"
                                aria-label="Wishlist"
                            >
                                <Heart size={20} strokeWidth={1.5} className="text-charcoal group-hover:text-gold-dark transition-colors" />
                                {hasMounted && wishlistState.totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                                        {wishlistState.totalItems}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/admin"
                                className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center hover:bg-black/5 hover:scale-110 active:scale-95 transition-all duration-300 group"
                                aria-label="Account"
                            >
                                <User size={20} strokeWidth={1.5} className="text-charcoal group-hover:text-gold-dark transition-colors" />
                            </Link>

                            <Link
                                href="/cart"
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 active:scale-95 transition-all duration-300 group relative"
                                aria-label="Cart"
                            >
                                <ShoppingBag size={20} strokeWidth={1.5} className="text-charcoal group-hover:text-gold-dark transition-colors" />
                                {hasMounted && cartState.totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                                        {cartState.totalItems}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                        >
                            <div className="container mx-auto px-4 py-4">
                                {/* Mobile Search */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsSearchOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 mb-3 bg-cream rounded-lg text-medium-gray"
                                >
                                    <Search size={18} />
                                    <span className="text-sm">Search products...</span>
                                </button>

                                {categories.map((category) => (
                                    <div key={category.name} className="border-b border-gray-50 last:border-0">
                                        <div className="py-2">
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={category.href}
                                                    className="flex-1 py-2 text-charcoal font-medium text-[0.9375rem]"
                                                    onClick={() => !category.submenu && setIsMenuOpen(false)}
                                                >
                                                    {category.name}
                                                </Link>
                                                {category.submenu && (
                                                    <button
                                                        onClick={() =>
                                                            setActiveDropdown(
                                                                activeDropdown === category.name ? null : category.name
                                                            )
                                                        }
                                                        className="p-2 text-medium-gray"
                                                    >
                                                        <ChevronDown
                                                            size={18}
                                                            className={`transition-transform duration-200 ${activeDropdown === category.name ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Mobile Submenu */}
                                            <AnimatePresence>
                                                {category.submenu && activeDropdown === category.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="pl-4 overflow-hidden"
                                                    >
                                                        {category.submenu.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block py-2.5 text-sm text-medium-gray hover:text-gold-primary"
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}

                                {/* Mobile Menu Footer */}
                                <div className="flex items-center gap-4 pt-4 mt-2">
                                    <Link
                                        href="/wishlist"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 text-sm text-charcoal hover:text-gold-primary"
                                    >
                                        <Heart size={18} />
                                        Wishlist
                                        {hasMounted && wishlistState.totalItems > 0 && (
                                            <span className="px-1.5 py-0.5 bg-gold-primary text-white text-xs rounded-full">
                                                {wishlistState.totalItems}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 text-sm text-charcoal hover:text-gold-primary"
                                    >
                                        <User size={18} />
                                        Account
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
