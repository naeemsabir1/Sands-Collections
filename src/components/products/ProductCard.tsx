'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, ProductBadge } from '@/lib/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
    product: Product;
}

const badgeStyles: Record<ProductBadge, { bg: string; text: string }> = {
    'best-seller': { bg: 'bg-black/80 backdrop-blur-md', text: 'Best Seller' },
    'new-arrival': { bg: 'bg-emerald-600/80 backdrop-blur-md', text: 'New' },
    'limited-stock': { bg: 'bg-amber-600/80 backdrop-blur-md', text: 'Limited' },
    'sale': { bg: 'bg-rose-600/80 backdrop-blur-md', text: 'Sale' },
};

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, isInCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const discount = product.salePrice && product.salePrice > 0
        ? calculateDiscount(product.price, product.salePrice)
        : 0;

    const isWishlisted = isInWishlist(product.id);
    const productUrl = `/products/${product.id}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 will-change-transform"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <Link href={productUrl} className="block relative h-full">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F7]">
                    <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={false}
                    />

                    {/* Secondary Image Reveal */}
                    {product.images[1] && (
                        <Image
                            src={product.images[1]}
                            alt={product.name}
                            fill
                            className="object-cover transition-opacity duration-500 absolute inset-0 opacity-0 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority={false}
                        />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                    {/* Glass Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.badge && (
                            <div className={`px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase shadow-sm backdrop-blur-md ${badgeStyles[product.badge].bg}`}>
                                {badgeStyles[product.badge].text}
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="px-3 py-1 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm self-start tracking-wide">
                                -{discount}%
                            </div>
                        )}
                    </div>

                    {/* Wishlist Button - CSS Hover Only */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${isWishlisted
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-white/80 backdrop-blur-sm text-charcoal hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100'
                            }`}
                        aria-label="Add to wishlist"
                    >
                        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
                    </button>

                    {/* Quick Add Button - CSS Slide Up */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full h-10 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md transition-all ${isInCart(product.id)
                                ? 'bg-charcoal text-white hover:bg-black'
                                : 'bg-white/95 text-charcoal hover:bg-gold-primary hover:text-white'
                                }`}
                        >
                            <ShoppingBag size={14} strokeWidth={2} />
                            {isInCart(product.id) ? 'Added' : 'Quick Add'}
                        </button>
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px] z-30">
                            <span className="px-4 py-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="py-4 px-2">
                    {/* Category */}
                    <p className="text-[10px] text-medium-gray/60 uppercase tracking-[0.2em] font-medium mb-1.5 transition-colors group-hover:text-gold-primary">
                        {product.category.replace('-', ' ')}
                    </p>

                    {/* Name */}
                    <h3 className="font-playfair text-charcoal text-base font-medium leading-snug mb-1.5 truncate group-hover:text-gold-dark transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.averageRating ? (
                        <div className="flex items-center gap-1 mb-2">
                            <Star size={12} className="fill-gold-primary text-gold-primary" />
                            <span className="text-xs font-semibold text-charcoal">{product.averageRating}</span>
                            <span className="text-[10px] text-medium-gray">({product.reviewCount})</span>
                        </div>
                    ) : (
                        <div className="h-5 mb-1" /> // Spacer for alignment
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {product.salePrice && product.salePrice > 0 ? (
                            <>
                                <span className="font-bold text-charcoal text-sm">
                                    {formatPrice(product.salePrice)}
                                </span>
                                <span className="text-[10px] text-medium-gray line-through decoration-1 opacity-70">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="font-medium text-charcoal text-sm">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
