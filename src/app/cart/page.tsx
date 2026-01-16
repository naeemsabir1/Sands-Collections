'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
    const { state, updateQuantity, removeItem } = useCart();

    const SHIPPING_COST = 250;
    const FREE_SHIPPING_THRESHOLD = 5000;
    const shippingCost = state.totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const progress = Math.min((state.totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

    if (state.items.length === 0) {
        return (
            <div className="min-h-[80vh] bg-[#FAFAFA] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md mx-auto"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gold-primary" strokeWidth={1.5} />
                    </div>
                    <h1 className="font-playfair text-3xl font-bold text-charcoal mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-medium-gray text-[15px] leading-relaxed mb-10">
                        Looks like you haven&apos;t found your perfect match yet.
                        Explore our latest collections to find something special.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-xl font-medium shadow-lg shadow-charcoal/20 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300">
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-12 lg:py-20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-2">
                            Shopping Cart
                        </h1>
                        <p className="text-medium-gray">
                            Review your selection ({state.totalItems} items)
                        </p>
                    </div>
                    <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-gold-primary hover:text-charcoal transition-colors">
                        Continue Shopping <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {state.items.map((item, index) => (
                                <motion.div
                                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-6"
                                >
                                    {/* Product Image */}
                                    <Link
                                        href={`/products/${item.product.id}`}
                                        className="relative w-28 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 group"
                                    >
                                        <Image
                                            src={item.product.images[0] || '/placeholder.jpg'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="112px"
                                        />
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-[10px] text-medium-gray uppercase tracking-widest font-bold mb-1.5">
                                                    {item.product.category.replace('-', ' ')}
                                                </p>
                                                <Link href={`/products/${item.product.id}`}>
                                                    <h3 className="font-playfair font-bold text-lg text-charcoal hover:text-gold-primary transition-colors line-clamp-1 mb-1">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                <div className="bg-gray-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-3 text-xs text-medium-gray mt-1">
                                                    {item.selectedSize && <span>Size: <span className='font-medium text-charcoal'>{item.selectedSize}</span></span>}
                                                    {item.selectedSize && item.selectedColor && <span className="w-1 h-3 border-r border-gray-300"></span>}
                                                    {item.selectedColor && <span>Color: <span className='font-medium text-charcoal'>{item.selectedColor}</span></span>}
                                                </div>
                                            </div>
                                            <p className="font-bold text-lg text-charcoal">
                                                {formatPrice(item.product.salePrice || item.product.price)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-white border border-gray-200 rounded-xl h-10 w-fit shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(
                                                        item.product.id,
                                                        item.quantity - 1,
                                                        item.selectedSize,
                                                        item.selectedColor
                                                    )}
                                                    className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-gray-50 rounded-l-xl transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-charcoal">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(
                                                        item.product.id,
                                                        item.quantity + 1,
                                                        item.selectedSize,
                                                        item.selectedColor
                                                    )}
                                                    className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-gray-50 rounded-r-xl transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                                                    className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-black/[0.02] sticky top-32">
                            <h2 className="font-playfair font-bold text-xl text-charcoal mb-6">Order Summary</h2>

                            {/* Free Shipping Progress */}
                            <div className="mb-8 p-4 bg-cream rounded-xl border border-gold-primary/10">
                                {shippingCost > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gold-dark mb-3 uppercase tracking-wider">
                                            <Truck size={14} />
                                            {progress < 100 ? 'Almost there!' : 'You got it!'}
                                        </div>
                                        <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, ease: 'circOut' }}
                                                className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                                            />
                                        </div>
                                        <p className="text-xs text-medium-gray mt-3 text-center font-medium">
                                            Add <span className="text-charcoal font-bold">{formatPrice(FREE_SHIPPING_THRESHOLD - state.totalPrice)}</span> for <span className="text-emerald-600 font-bold">Free Shipping</span>
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-bold">
                                        <ShieldCheck size={18} />
                                        You&apos;ve qualified for Free Shipping!
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-medium-gray font-medium">Subtotal</span>
                                    <span className="font-bold text-charcoal">{formatPrice(state.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-medium-gray font-medium">Shipping Estimate</span>
                                    {shippingCost === 0 ? (
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Free</span>
                                    ) : (
                                        <span className="font-bold text-charcoal">{formatPrice(shippingCost)}</span>
                                    )}
                                </div>
                                <div className="h-px bg-gray-100 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-playfair font-bold text-lg text-charcoal">Total</span>
                                    <div className="text-right">
                                        <span className="block font-bold text-2xl text-charcoal tracking-tight">
                                            {formatPrice(state.totalPrice + shippingCost)}
                                        </span>
                                        <span className="text-[10px] text-medium-gray uppercase tracking-widest font-medium">Including Taxes</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn-gold w-full text-center relative group overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight size={18} />
                                </span>
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-medium-gray grayscale opacity-60">
                                {/* Add icons/logos for payment methods here if needed */}
                                <span>Secure Checkout</span>
                                <span>•</span>
                                <span>SSL Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
