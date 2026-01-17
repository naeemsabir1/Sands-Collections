'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Save, Loader2, RefreshCw, Filter, ChevronDown, Sparkles } from 'lucide-react';
import { Product, ProductCategory, ProductBadge } from '@/lib/types';
import { formatPrice, convertDriveLink } from '@/lib/utils';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/firestore';
import Image from 'next/image';

const productCategories: { value: ProductCategory; label: string }[] = [
    { value: 'mens-shawls', label: "Men's Shawls" },
    { value: 'mens-unstitched-suiting', label: "Men's Unstitched Suiting" },
    { value: 'womens-shawls', label: "Women's Shawls" },
    { value: 'womens-duppattas', label: "Duppattas" },
    { value: 'fragrances-mens', label: 'Fragrances - Mens' },
    { value: 'fragrances-womens', label: 'Fragrances - Womens' },
    { value: 'fragrances-unisex', label: 'Fragrances - Unisex' },
    { value: 'ihram-ladies', label: 'Ladies Ihram' },
    { value: 'ihram-gents', label: 'Gents Ihram' },
];

const badges: { value: ProductBadge | ''; label: string }[] = [
    { value: '', label: 'No Badge' },
    { value: 'best-seller', label: 'Best Seller' },
    { value: 'new-arrival', label: 'New Arrival' },
    { value: 'limited-stock', label: 'Limited Stock' },
    { value: 'sale', label: 'Sale' },
];

export function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [productForm, setProductForm] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        salePrice: undefined,
        images: [''],
        category: 'mens-shawls',
        inStock: true,
        badge: undefined,
        newArrival: false,
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProduct = async () => {
        if (!productForm.name || !productForm.price) return;
        setIsSaving(true);

        try {
            const processedImages = (productForm.images || []).map((img) => convertDriveLink(img));

            const productData = {
                name: productForm.name || '',
                description: productForm.description || '',
                price: productForm.price || 0,
                salePrice: productForm.salePrice || undefined,
                images: processedImages,
                category: productForm.category || 'mens-shawls',
                inStock: productForm.inStock ?? true,
                badge: productForm.badge as ProductBadge | undefined,
                newArrival: productForm.newArrival || false,
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
            }

            await loadProducts();
            resetProductForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm(product);
        setIsAddingProduct(true);
    };

    const resetProductForm = () => {
        setEditingProduct(null);
        setIsAddingProduct(false);
        setProductForm({
            name: '',
            description: '',
            price: 0,
            salePrice: undefined,
            images: [''],
            category: 'mens-shawls',
            inStock: true,
            badge: undefined,
            newArrival: false,
        });
    };

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-charcoal">Products</h2>
                    <p className="text-medium-gray mt-1">Manage your inventory and product listings</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadProducts}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-medium-gray hover:text-charcoal transition-colors shadow-sm hover:shadow-md"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setIsAddingProduct(true)}
                        className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-gold-primary/20 hover:shadow-gold-primary/40 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-charcoal font-medium rounded-xl hover:bg-gray-100 transition-colors">
                    <Filter size={18} /> Filters <ChevronDown size={14} />
                </button>
            </div>

            {/* Products Table */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 size={48} className="animate-spin text-gold-primary" />
                    <p className="text-medium-gray animate-pulse">Loading collection...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-8 py-5 text-xs font-bold text-medium-gray uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-5 text-xs font-bold text-medium-gray uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-5 text-xs font-bold text-medium-gray uppercase tracking-wider">Price</th>
                                    <th className="text-left px-6 py-5 text-xs font-bold text-medium-gray uppercase tracking-wider">Status</th>
                                    <th className="text-right px-8 py-5 text-xs font-bold text-medium-gray uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                    {product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-charcoal">{product.name}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {product.badge && (
                                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-primary tracking-wide">
                                                                {product.badge.replace('-', ' ')}
                                                            </span>
                                                        )}
                                                        {product.newArrival && (
                                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 tracking-wide flex items-center gap-1">
                                                                <span>New</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-medium-gray bg-gray-100 px-3 py-1 rounded-full">
                                                {productCategories.find((c) => c.value === product.category)?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-charcoal">{formatPrice(product.salePrice || product.price)}</p>
                                                {product.salePrice && (
                                                    <p className="text-xs text-medium-gray line-through">{formatPrice(product.price)}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 text-medium-gray hover:text-gold-primary hover:bg-gold-primary/10 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-medium-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <div className="py-16 text-center text-medium-gray bg-gray-50/30">
                                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-lg font-medium text-charcoal">No products found</p>
                                <p className="text-sm">Try adjusting your search or add a new product.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isAddingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetProductForm}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                                <div>
                                    <h3 className="font-playfair text-2xl font-bold text-charcoal">
                                        {editingProduct ? 'Edit Product' : 'New Product'}
                                    </h3>
                                    <p className="text-sm text-medium-gray">
                                        {editingProduct ? 'Update existing product details' : 'Add a new item to your collection'}
                                    </p>
                                </div>
                                <button
                                    onClick={resetProductForm}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-charcoal transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Basic Info */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Product Name</label>
                                            <input
                                                type="text"
                                                value={productForm.name || ''}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none"
                                                placeholder="e.g. Royal Pashmina Shawl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Description</label>
                                            <textarea
                                                value={productForm.description || ''}
                                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none resize-none"
                                                rows={4}
                                                placeholder="Describe the product features, material, etc."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-charcoal">Category</label>
                                                <select
                                                    value={productForm.category || ''}
                                                    onChange={(e) =>
                                                        setProductForm({ ...productForm, category: e.target.value as ProductCategory })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none appearance-none"
                                                >
                                                    {productCategories.map((cat) => (
                                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-charcoal">Status</label>
                                                <div className="flex gap-4 pt-3">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${productForm.inStock ? 'bg-gold-primary border-gold-primary' : 'border-gray-300'}`}>
                                                            {productForm.inStock && <Sparkles size={12} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={productForm.inStock}
                                                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                                            className="hidden"
                                                        />
                                                        <span className="text-sm font-medium text-charcoal group-hover:text-gold-primary transition-colors">In Stock</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Pricing & Media */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-charcoal">Price (PKR)</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs.</span>
                                                    <input
                                                        type="number"
                                                        value={productForm.price || ''}
                                                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-charcoal">Sale Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs.</span>
                                                    <input
                                                        type="number"
                                                        value={productForm.salePrice || ''}
                                                        onChange={(e) =>
                                                            setProductForm({
                                                                ...productForm,
                                                                salePrice: e.target.value ? Number(e.target.value) : undefined,
                                                            })
                                                        }
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none"
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Promotional Badge</label>
                                            <select
                                                value={productForm.badge || ''}
                                                onChange={(e) =>
                                                    setProductForm({
                                                        ...productForm,
                                                        badge: e.target.value as ProductBadge | undefined,
                                                    })
                                                }
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none appearance-none"
                                            >
                                                {badges.map((badge) => (
                                                    <option key={badge.value} value={badge.value}>{badge.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-charcoal">Product Image URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={productForm.images?.[0] || ''}
                                                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all outline-none"
                                                    placeholder="Paste Google Drive link"
                                                />
                                            </div>

                                            {/* Image Preview */}
                                            <div className="mt-4 relative h-48 w-full rounded-2xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                                                {productForm.images?.[0] ? (
                                                    <Image
                                                        src={convertDriveLink(productForm.images[0])}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-400">
                                                        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                                        <span className="text-sm">Image preview will appear here</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${productForm.newArrival ? 'bg-gold-primary border-gold-primary' : 'border-gray-300'}`}>
                                                    {productForm.newArrival && <Sparkles size={12} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={productForm.newArrival || false}
                                                    onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                                                    className="hidden"
                                                />
                                                <span className="font-medium text-charcoal flex items-center gap-2">
                                                    Mark as New Arrival <span className="text-xs bg-gold-primary/10 text-gold-primary px-2 py-0.5 rounded-full">Boost Visibility</span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                                <button
                                    onClick={resetProductForm}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-charcoal font-medium hover:bg-white transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProduct}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gold-primary transition-all shadow-lg shadow-charcoal/20 hover:shadow-gold-primary/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ImageIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}
