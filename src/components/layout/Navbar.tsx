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
    ChevronDown,
    User
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { SearchModal } from './SearchModal';
import { LogoIcon } from '@/components/ui/LogoIcon';

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
    }
];

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const { state: cartState } = useCart();

    // Handle scroll for navbar styling
    useEffect(() => {
        setHasMounted(true);
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
            {/* Premium Sticky Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isScrolled
                ? 'bg-black shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
                : 'bg-[#0F0F0F] bg-opacity-95 backdrop-blur-md py-5 border-b border-white/5'
                }`}>
                <nav className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 -ml-2 text-[#D4AF77] hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                        </button>

                        {/* Logo Area */}
                        <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
                            {/* Premium Logo Icon */}
                            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center text-[#D4AF77] group-hover:text-white transition-colors duration-500 group-hover:drop-shadow-[0_0_8px_rgba(212,175,119,0.8)]">
                                <LogoIcon className="w-full h-full" />
                            </div>
                            <div className="flex flex-col items-center lg:items-start group cursor-pointer">
                                <h1 className="font-playfair text-2xl md:text-3xl lg:text-[34px] font-semibold tracking-wide text-[#D4AF77] group-hover:text-[#F3E5AB] transition-colors duration-500 whitespace-nowrap drop-shadow-md">
                                    SANDS <span className="font-light italic tracking-normal">Collections</span>
                                </h1>
                                <p className="text-[9px] md:text-[10px] font-light tracking-[0.4em] uppercase text-[#FFFDD0]/90 mt-1 whitespace-nowrap">
                                    Timeless Pakistani Luxury
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden lg:flex items-center gap-10">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(category.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={category.href}
                                        className="flex items-center gap-1.5 py-2 text-[0.875rem] font-medium text-white/90 hover:text-white transition-all duration-300 hover:-translate-y-0.5 group"
                                    >
                                        <span className="font-sans">{category.name}</span>
                                        {/* Premium Gold Underline */}
                                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF77] group-hover:w-full transition-all duration-300 ease-out opacity-80" />

                                        {category.submenu && (
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 text-[#D4AF77]/70 ${activeDropdown === category.name ? 'rotate-180 text-[#D4AF77]' : ''
                                                    }`}
                                            />
                                        )}
                                    </Link>

                                    {/* Glass Dropdown Menu */}
                                    {category.submenu && (
                                        <AnimatePresence>
                                            {activeDropdown === category.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-max"
                                                >
                                                    <div className="min-w-[240px] bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-none p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                                                        {category.submenu.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block px-5 py-3.5 text-sm font-light text-white/80 hover:bg-white/5 hover:text-[#D4AF77] transition-all duration-300 hover:pl-7"
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

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 flex items-center justify-center text-[#D4AF77] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label="Search"
                            >
                                <Search size={22} strokeWidth={1.5} />
                            </button>

                            <Link
                                href="/admin"
                                className="hidden lg:flex w-10 h-10 items-center justify-center text-[#D4AF77] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label="Account"
                            >
                                <User size={22} strokeWidth={1.5} />
                            </Link>

                            <Link
                                href="/cart"
                                className="w-10 h-10 flex items-center justify-center text-[#D4AF77] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 relative"
                                aria-label="Cart"
                            >
                                <ShoppingBag size={22} strokeWidth={1.5} />
                                {hasMounted && cartState.totalItems > 0 && (
                                    <span className="absolute 0 right-0 w-4 h-4 bg-[#D4AF77] text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
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
                            animate={{ opacity: 1, height: '100vh' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                            className="lg:hidden absolute top-full left-0 w-full bg-[#0A0A0A] border-t border-white/10 overflow-hidden"
                            style={{ height: 'calc(100vh - 70px)' }}
                        >
                            <div className="container mx-auto px-6 py-8 flex flex-col h-full">
                                {/* Mobile Search */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsSearchOpen(true);
                                    }}
                                    className="w-full flex items-center gap-4 px-5 py-4 mb-8 bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <Search size={20} />
                                    <span className="font-light tracking-wide">Search luxurious items...</span>
                                </button>

                                <div className="flex-1 overflow-y-auto">
                                    {categories.map((category) => (
                                        <div key={category.name} className="border-b border-white/10 last:border-0 pl-2">
                                            <div className="py-2">
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={category.href}
                                                        className="flex-1 py-4 text-white text-lg font-light tracking-wide"
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
                                                            className="p-4 text-[#D4AF77]"
                                                        >
                                                            <ChevronDown
                                                                size={20}
                                                                className={`transition-transform duration-300 ${activeDropdown === category.name ? 'rotate-180' : ''
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
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-6 pb-4 flex flex-col gap-4">
                                                                {category.submenu.map((item) => (
                                                                    <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        className="text-white/60 text-[0.9375rem] font-light hover:text-[#D4AF77] transition-colors"
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Footer Links */}
                                <div className="mt-auto pt-8 border-t border-white/10 flex justify-between px-2">
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 text-sm text-[#D4AF77] hover:text-white uppercase tracking-wider font-medium"
                                    >
                                        <User size={18} />
                                        My Account
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
