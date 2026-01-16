'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
    const { state, removeFromWishlist, clearWishlist } = useWishlist();
    const { addItem, isInCart } = useCart();

    const handleAddToCart = (product: typeof state.items[0]) => {
        addItem(product);
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream flex items-center justify-center">
                        <Heart size={32} className="text-medium-gray" />
                    </div>
                    <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-charcoal mb-3">
                        Your Wishlist is Empty
                    </h1>
                    <p className="text-medium-gray text-sm mb-8">
                        Start adding items you love to your wishlist by clicking the heart icon on any product.
                    </p>
                    <Link href="/" className="btn-gold">
                        Explore Products <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-charcoal">
                                My Wishlist
                            </h1>
                            <p className="text-medium-gray text-sm mt-1">{state.totalItems} item{state.totalItems !== 1 ? 's' : ''} saved</p>
                        </div>
                        <button
                            onClick={clearWishlist}
                            className="text-sm text-medium-gray hover:text-rose-500 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {state.items.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl overflow-hidden group"
                        >
                            {/* Product Image */}
                            <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-cream">
                                <Image
                                    src={product.images[0] || '/placeholder.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                {/* Remove from Wishlist */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFromWishlist(product.id);
                                    }}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 transition-colors"
                                    aria-label="Remove from wishlist"
                                >
                                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                                </button>

                                {/* Badge */}
                                {product.badge && (
                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-[10px] font-semibold ${product.badge === 'best-seller' ? 'bg-charcoal' :
                                            product.badge === 'new-arrival' ? 'bg-emerald-500' :
                                                product.badge === 'limited-stock' ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}>
                                        {product.badge === 'best-seller' ? 'Best Seller' :
                                            product.badge === 'new-arrival' ? 'New' :
                                                product.badge === 'limited-stock' ? 'Limited' : 'Sale'}
                                    </div>
                                )}
                            </Link>

                            {/* Product Info */}
                            <div className="p-4">
                                <p className="text-[10px] text-medium-gray uppercase tracking-widest mb-1">
                                    {product.category.replace('-', ' ')}
                                </p>
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-medium text-charcoal text-sm mb-2 line-clamp-1 hover:text-gold-primary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-4">
                                    {product.salePrice && product.salePrice > 0 ? (
                                        <>
                                            <span className="font-semibold text-charcoal text-sm">{formatPrice(product.salePrice)}</span>
                                            <span className="text-xs text-medium-gray line-through">{formatPrice(product.price)}</span>
                                        </>
                                    ) : (
                                        <span className="font-semibold text-charcoal text-sm">{formatPrice(product.price)}</span>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!product.inStock}
                                    className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${!product.inStock
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : isInCart(product.id)
                                                ? 'bg-charcoal text-white'
                                                : 'bg-gold-primary text-white hover:bg-gold-dark'
                                        }`}
                                >
                                    <ShoppingBag size={14} />
                                    {!product.inStock ? 'Out of Stock' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
