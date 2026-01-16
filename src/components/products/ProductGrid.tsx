'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';

interface ProductGridProps {
    products: Product[];
    columns?: 2 | 3 | 4;
    loading?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

// Skeleton loader for products
function ProductSkeleton() {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );
}

export function ProductGrid({ products, columns = 4, loading = false }: ProductGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    if (loading) {
        return (
            <div className={`grid ${gridCols[columns]} gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">No Products Found</h3>
                <p className="text-medium-gray">Try adjusting your filters or check back later.</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={`grid ${gridCols[columns]} gap-6`}
        >
            {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
}
