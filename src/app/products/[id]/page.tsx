'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield, Check, Star, Loader2 } from 'lucide-react';
import { ImageZoom } from '@/components/products/ImageZoom';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Product } from '@/lib/types';
import { getProductById, getProducts } from '@/lib/firestore';
import { use } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const { addItem, isInCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        async function loadProduct() {
            setIsLoading(true);
            try {
                const fetchedProduct = await getProductById(id);
                setProduct(fetchedProduct);

                // Get related products
                if (fetchedProduct) {
                    const allProducts = await getProducts();
                    const related = allProducts
                        .filter(p => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-gold-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-charcoal mb-4">Product Not Found</h1>
                    <p className="text-medium-gray mb-8 text-sm">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/" className="btn-gold">Back to Home</Link>
                </div>
            </div>
        );
    }

    const discount = product.salePrice ? calculateDiscount(product.price, product.salePrice) : 0;

    const handleAddToCart = () => {
        addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
    };

    const handleBuyNow = () => {
        addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
        window.location.href = '/checkout';
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Breadcrumb - Clean & Minimal */}
            <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-6 lg:px-12 py-4">
                    <nav className="text-xs tracking-wide text-medium-gray flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-gold-primary transition-colors">Home</Link>
                        <ChevronRight size={10} className="text-gray-300" />
                        <Link href={`/${product.category.split('-')[0]}`} className="hover:text-gold-primary transition-colors capitalize">
                            {product.category.split('-')[0].replace('mens', "Men's").replace('womens', "Women's")}
                        </Link>
                        <ChevronRight size={10} className="text-gray-300" />
                        <span className="text-charcoal font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Section */}
            <section className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Image Gallery - Left Side (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Main Image with Zoom */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-sm border border-black/[0.03] group"
                        >
                            <ImageZoom
                                src={product.images[activeImage] || '/placeholder.jpg'}
                                alt={product.name}
                                className="w-full h-full"
                            />

                            {/* Floating Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.badge && (
                                    <span className={`px-4 py-2 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md ${product.badge === 'best-seller' ? 'bg-charcoal/90' :
                                        product.badge === 'new-arrival' ? 'bg-emerald-600/90' :
                                            product.badge === 'limited-stock' ? 'bg-amber-600/90' : 'bg-rose-600/90'
                                        }`}>
                                        {product.badge.replace('-', ' ')}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="px-4 py-2 rounded-full bg-rose-500/90 text-white text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md self-start">
                                        -{discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Image Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                                    >
                                        <ChevronRight size={20} className="rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage((prev) => (prev + 1) % product.images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </motion.div>

                        {/* Thumbnail Strip */}
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx
                                            ? 'border-gold-primary ring-2 ring-gold-primary/20 scale-105 shadow-md'
                                            : 'border-transparent hover:border-gray-200 grayscale hover:grayscale-0'
                                            }`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="96px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info - Right Side (Sticky) - 5 Cols */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto scrollbar-hide">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-8"
                            >
                                {/* Header Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gold-primary uppercase tracking-[0.2em]">
                                            {product.category.replace('-', ' ')}
                                        </p>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs text-medium-gray ml-2 font-normal">(45 Reviews)</span>
                                        </div>
                                    </div>

                                    <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.15]">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-baseline gap-4">
                                        {product.salePrice ? (
                                            <>
                                                <span className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                                                    {formatPrice(product.salePrice)}
                                                </span>
                                                <span className="text-xl text-medium-gray/60 line-through font-light">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-black/[0.06] w-full" />

                                {/* Description */}
                                <div className="prose prose-sm prose-gray max-w-none">
                                    <p className="text-medium-gray text-[15px] leading-7 font-light">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Selectors */}
                                <div className="space-y-6">
                                    {/* Material Badge */}
                                    {product.material && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.03] rounded-lg border border-black/[0.04]">
                                            <span className="text-xs text-medium-gray uppercase tracking-wider font-semibold">Material:</span>
                                            <span className="text-sm font-medium text-charcoal">{product.material}</span>
                                        </div>
                                    )}

                                    {/* Colors */}
                                    {product.colors && product.colors.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-bold text-charcoal mb-3">
                                                Color: <span className="font-normal text-medium-gray">{selectedColor || 'Select a color'}</span>
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {product.colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`h-11 px-6 rounded-full border text-sm font-medium transition-all duration-300 ${selectedColor === color
                                                            ? 'border-gold-primary bg-gold-primary/10 text-gold-dark shadow-sm scale-105'
                                                            : 'border-gray-200 text-charcoal hover:border-gold-primary'
                                                            }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sizes */}
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-bold text-charcoal">
                                                    Size
                                                </label>
                                                <button className="text-xs text-medium-gray underline hover:text-gold-primary">Size Guide</button>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {product.sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`w-14 h-14 rounded-xl border flex items-center justify-center text-sm font-bold transition-all duration-300 ${selectedSize === size
                                                            ? 'border-charcoal bg-charcoal text-white shadow-lg shadow-charcoal/20 scale-105'
                                                            : 'border-gray-200 text-charcoal hover:border-gold-primary hover:text-gold-primary'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4">
                                        {/* Quantity */}
                                        <div className="flex items-center bg-white border border-gray-200 rounded-xl h-14 p-1 shadow-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-charcoal">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Add to Cart */}
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className={`flex-1 h-14 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${!product.inStock
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isInCart(product.id)
                                                    ? 'bg-charcoal text-white shadow-charcoal/20'
                                                    : 'bg-gold-primary text-white shadow-gold-primary/30 hover:bg-gold-dark'
                                                }`}
                                        >
                                            <ShoppingBag size={20} />
                                            {!product.inStock ? 'Out of Stock' : isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                                        </button>

                                        {/* Wishlist */}
                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isInWishlist(product.id)
                                                ? 'border-rose-500 bg-rose-50 text-rose-500 shadow-rose-500/10'
                                                : 'border-gray-200 text-medium-gray hover:border-rose-500 hover:text-rose-500 bg-white'
                                                }`}
                                        >
                                            <Heart size={22} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} strokeWidth={2} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={!product.inStock}
                                        className="w-full h-14 rounded-xl font-bold border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 flex items-center justify-center uppercase tracking-widest text-sm hover:shadow-lg"
                                    >
                                        Buy it Now
                                    </button>
                                </div>

                                {/* Trust Attributes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                                            <Truck size={20} className="text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal text-sm">Free Shipping</p>
                                            <p className="text-xs text-medium-gray mt-0.5">On orders over PKR 5,000</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                                            <RotateCcw size={20} className="text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal text-sm">Easy Returns</p>
                                            <p className="text-xs text-medium-gray mt-0.5">7-day hustle-free policy</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                                            <Check size={20} className="text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal text-sm">Authentic Product</p>
                                            <p className="text-xs text-medium-gray mt-0.5">100% original guaranteed</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                                            <Shield size={20} className="text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal text-sm">Secure Payment</p>
                                            <p className="text-xs text-medium-gray mt-0.5">Cash on delivery available</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="bg-white py-24 border-t border-gray-100">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="text-center mb-16">
                            <span className="text-gold-primary font-medium tracking-[0.3em] text-sm uppercase">Discover More</span>
                            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mt-3">You May Also Like</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
