'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterBar } from '@/components/products/FilterBar';
import { Product, ProductFilters } from '@/lib/types';
import { getProducts } from '@/lib/firestore';

const materials = ['Cotton Blend', 'Premium Cotton', 'Cotton'];

export default function LadiesIhramPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({});

    useEffect(() => {
        async function loadProducts() {
            setIsLoading(true);
            try {
                const allProducts = await getProducts();
                const ihramProducts = allProducts.filter(p => p.category === 'ihram-ladies');
                setProducts(ihramProducts);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.priceRange) {
            result = result.filter(p => {
                const price = p.salePrice || p.price;
                return price >= filters.priceRange![0] && price <= filters.priceRange![1];
            });
        }

        if (filters.material) {
            result = result.filter(p => p.material === filters.material);
        }

        if (filters.inStock) {
            result = result.filter(p => p.inStock);
        }

        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-asc':
                    result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                    break;
                case 'price-desc':
                    result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                    break;
                case 'newest':
                    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
            }
        }

        return result;
    }, [products, filters]);

    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-72 md:h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                </div>
                <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white max-w-2xl"
                    >
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-4 border border-white/20">
                            Sacred Garments
                        </span>
                        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Ladies Ihram
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                            Comfortable and modest Ihram sets for ladies. Designed for your spiritual journey with maximum comfort.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                showMaterialFilter
                materials={materials}
            />

            {/* Products Grid */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-gold-primary" />
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-medium-gray text-[15px]">
                                Showing <span className="font-bold text-charcoal">{filteredProducts.length}</span> products
                            </p>
                        </div>
                        <ProductGrid products={filteredProducts} columns={3} />
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-medium-gray">
                                No Ihram products found. Add products in the admin panel.
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
