'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductFilters } from '@/lib/types';

interface FilterBarProps {
    filters: ProductFilters;
    onFilterChange: (filters: ProductFilters) => void;
    showMaterialFilter?: boolean;
    showSubcategoryFilter?: boolean;
    subcategories?: string[];
    materials?: string[];
}

const priceRanges = [
    { label: 'All Prices', value: null },
    { label: 'Under PKR 5,000', value: [0, 5000] as [number, number] },
    { label: 'PKR 5,000 - 10,000', value: [5000, 10000] as [number, number] },
    { label: 'PKR 10,000 - 25,000', value: [10000, 25000] as [number, number] },
    { label: 'PKR 25,000 - 50,000', value: [25000, 50000] as [number, number] },
    { label: 'PKR 50,000+', value: [50000, 1000000] as [number, number] },
];

const sortOptions = [
    { label: 'Newest First', value: 'newest' as const },
    { label: 'Price: Low to High', value: 'price-asc' as const },
    { label: 'Price: High to Low', value: 'price-desc' as const },
    { label: 'Most Popular', value: 'popular' as const },
];

export function FilterBar({
    filters,
    onFilterChange,
    showMaterialFilter = false,
    showSubcategoryFilter = false,
    subcategories = [],
    materials = [],
}: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    const hasActiveFilters = filters.priceRange || filters.material || filters.subcategory || filters.inStock;

    return (
        <div className="bg-white border-b border-gray-100 sticky top-[64px] lg:top-[80px] z-40">
            <div className="container mx-auto px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden flex items-center gap-2 text-charcoal font-medium"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-gold-primary text-white text-xs rounded-full flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>

                    {/* Desktop Filters */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Subcategory Filter */}
                        {showSubcategoryFilter && subcategories.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'subcategory' ? null : 'subcategory')}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gold-primary transition-colors"
                                >
                                    {filters.subcategory || 'All Types'}
                                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'subcategory' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'subcategory' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                                        >
                                            <button
                                                onClick={() => {
                                                    updateFilter('subcategory', undefined);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors"
                                            >
                                                All Types
                                            </button>
                                            {subcategories.map((sub) => (
                                                <button
                                                    key={sub}
                                                    onClick={() => {
                                                        updateFilter('subcategory', sub);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors"
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Price Range Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gold-primary transition-colors"
                            >
                                {filters.priceRange ? `PKR ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}` : 'Price Range'}
                                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'price' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                                    >
                                        {priceRanges.map((range) => (
                                            <button
                                                key={range.label}
                                                onClick={() => {
                                                    updateFilter('priceRange', range.value || undefined);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors"
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Material Filter */}
                        {showMaterialFilter && materials.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'material' ? null : 'material')}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gold-primary transition-colors"
                                >
                                    {filters.material || 'Material'}
                                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'material' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'material' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                                        >
                                            <button
                                                onClick={() => {
                                                    updateFilter('material', undefined);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors"
                                            >
                                                All Materials
                                            </button>
                                            {materials.map((material) => (
                                                <button
                                                    key={material}
                                                    onClick={() => {
                                                        updateFilter('material', material);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors"
                                                >
                                                    {material}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* In Stock Only */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.inStock || false}
                                onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                                className="w-4 h-4 rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
                            />
                            <span className="text-sm text-charcoal">In Stock Only</span>
                        </label>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-medium-gray hover:text-red-500 transition-colors"
                            >
                                <X size={14} /> Clear
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gold-primary transition-colors text-sm"
                        >
                            {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Sort By'}
                            <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {activeDropdown === 'sort' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                                >
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                updateFilter('sortBy', option.value);
                                                setActiveDropdown(null);
                                            }}
                                            className={`w-full px-4 py-3 text-left text-sm hover:bg-off-white transition-colors ${filters.sortBy === option.value ? 'bg-off-white text-gold-primary' : ''
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Filter Panel */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden mt-4 pt-4 border-t border-gray-100 space-y-4"
                        >
                            {/* Mobile Price Range */}
                            <div>
                                <label className="text-sm font-medium text-charcoal mb-2 block">Price Range</label>
                                <select
                                    value={filters.priceRange ? JSON.stringify(filters.priceRange) : ''}
                                    onChange={(e) => updateFilter('priceRange', e.target.value ? JSON.parse(e.target.value) : undefined)}
                                    className="select"
                                >
                                    {priceRanges.map((range) => (
                                        <option key={range.label} value={range.value ? JSON.stringify(range.value) : ''}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile In Stock */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.inStock || false}
                                    onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
                                />
                                <span className="text-sm text-charcoal">In Stock Only</span>
                            </label>

                            {/* Mobile Clear */}
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="w-full py-2 text-center text-sm text-red-500 border border-red-200 rounded-lg">
                                    Clear All Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Click outside to close dropdowns */}
            {activeDropdown && (
                <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />
            )}
        </div>
    );
}
