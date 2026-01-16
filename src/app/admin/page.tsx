'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Settings,
    Image as ImageIcon,
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Save,
    Eye,
    Loader2,
    RefreshCw,
    Layout,
    Grid3X3,
    Sparkles,
} from 'lucide-react';
import { Product, ProductCategory, ProductBadge, HeroSlide, CuratedCategory, FeaturedCollection, NewArrivalShowcase } from '@/lib/types';
import { formatPrice, convertDriveLink } from '@/lib/utils';
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getHeroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    getCuratedCategories,
    addCuratedCategory,
    updateCuratedCategory,
    deleteCuratedCategory,
    getFeaturedCollections,
    addFeaturedCollection,
    updateFeaturedCollection,
    deleteFeaturedCollection,
    getNewArrivalShowcases,
    addNewArrivalShowcase,
    updateNewArrivalShowcase,
    deleteNewArrivalShowcase,
} from '@/lib/firestore';
import Image from 'next/image';

// Product categories for filtering
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

// Link options for Categories and Featured (matching actual pages)
const linkOptions = [
    { value: '/men/shawls', label: "Men's Shawls" },
    { value: '/men/unstitched-suiting', label: "Men's Unstitched Suiting" },
    { value: '/women/shawls', label: "Women's Shawls" },
    { value: '/women/duppattas', label: "Duppattas" },
    { value: '/fragrances/mens', label: 'Fragrances - Mens' },
    { value: '/fragrances/womens', label: 'Fragrances - Womens' },
    { value: '/fragrances/unisex', label: 'Fragrances - Unisex' },
    { value: '/ihram/ladies', label: 'Ladies Ihram' },
    { value: '/ihram/gents', label: 'Gents Ihram' },
    { value: '/men', label: "Men's (Overview)" },
    { value: '/women', label: "Women's (Overview)" },
    { value: '/fragrances', label: 'Fragrances (Overview)' },
    { value: '/ihram', label: 'Ihram (Overview)' },
];

const badges: { value: ProductBadge | ''; label: string }[] = [
    { value: '', label: 'No Badge' },
    { value: 'best-seller', label: 'Best Seller' },
    { value: 'new-arrival', label: 'New Arrival' },
    { value: 'limited-stock', label: 'Limited Stock' },
    { value: 'sale', label: 'Sale' },
];

type Tab = 'products' | 'hero' | 'categories' | 'featured' | 'newarrivals' | 'orders' | 'settings';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [curatedCategories, setCuratedCategories] = useState<CuratedCategory[]>([]);
    const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
    const [newArrivalShowcases, setNewArrivalShowcases] = useState<NewArrivalShowcase[]>([]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Hero slide form
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [isAddingSlide, setIsAddingSlide] = useState(false);
    const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: '',
        ctaLink: '',
        order: 0,
    });

    // Category form
    const [editingCategory, setEditingCategory] = useState<CuratedCategory | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryForm, setCategoryForm] = useState<Partial<CuratedCategory>>({
        name: '',
        description: '',
        image: '',
        href: '/men/shawls',
        order: 0,
    });

    // Featured form
    const [editingFeatured, setEditingFeatured] = useState<FeaturedCollection | null>(null);
    const [isAddingFeatured, setIsAddingFeatured] = useState(false);
    const [featuredForm, setFeaturedForm] = useState<Partial<FeaturedCollection>>({
        title: '',
        subtitle: '',
        image: '',
        href: '/men/shawls',
        span: 'medium',
        order: 0,
    });

    // New Arrival Showcase form
    const [editingShowcase, setEditingShowcase] = useState<NewArrivalShowcase | null>(null);
    const [isAddingShowcase, setIsAddingShowcase] = useState(false);
    const [showcaseForm, setShowcaseForm] = useState<Partial<NewArrivalShowcase>>({
        media: '',
        mediaType: 'image',
        linkedProductId: '',
        title: '',
        order: 0,
    });

    // Product form state
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

    // Load all data on mount
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoading(true);
        try {
            console.log('Loading admin data...');
            const [fetchedProducts, fetchedSlides, fetchedCategories, fetchedFeatured, fetchedShowcases] = await Promise.all([
                getProducts(),
                getHeroSlides(),
                getCuratedCategories(),
                getFeaturedCollections(),
                getNewArrivalShowcases(),
            ]);
            console.log('Fetched categories:', fetchedCategories);
            console.log('Fetched featured:', fetchedFeatured);
            setProducts(fetchedProducts);
            setHeroSlides(fetchedSlides);
            setCuratedCategories(fetchedCategories);
            setFeaturedCollections(fetchedFeatured);
            setNewArrivalShowcases(fetchedShowcases);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ==================== PRODUCT HANDLERS ====================

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

            await loadAllData();
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
                await loadAllData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
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

    // ==================== HERO SLIDE HANDLERS ====================

    const handleSaveSlide = async () => {
        if (!slideForm.title || !slideForm.image) return;
        setIsSaving(true);

        try {
            const slideData = {
                title: slideForm.title || '',
                subtitle: slideForm.subtitle || '',
                description: slideForm.description || '',
                image: convertDriveLink(slideForm.image || ''),
                ctaText: slideForm.ctaText || '',
                ctaLink: slideForm.ctaLink || '',
                order: slideForm.order || 0,
            };

            if (editingSlide) {
                await updateHeroSlide(editingSlide.id, slideData);
            } else {
                await addHeroSlide(slideData);
            }

            await loadAllData();
            resetSlideForm();
        } catch (error) {
            console.error('Error saving slide:', error);
            alert('Failed to save slide. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            try {
                await deleteHeroSlide(id);
                await loadAllData();
            } catch (error) {
                console.error('Error deleting slide:', error);
            }
        }
    };

    const handleEditSlide = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setSlideForm(slide);
        setIsAddingSlide(true);
    };

    const resetSlideForm = () => {
        setEditingSlide(null);
        setIsAddingSlide(false);
        setSlideForm({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            ctaText: '',
            ctaLink: '',
            order: heroSlides.length,
        });
    };

    // ==================== CATEGORY HANDLERS ====================

    const handleSaveCategory = async () => {
        if (!categoryForm.name || !categoryForm.image || !categoryForm.href) {
            alert('Please fill in all required fields (Name, Image, Category Link)');
            return;
        }
        setIsSaving(true);

        try {
            const categoryData = {
                name: categoryForm.name || '',
                description: categoryForm.description || '',
                image: convertDriveLink(categoryForm.image || ''),
                href: categoryForm.href || '/men/shawls',
                order: categoryForm.order || 0,
            };

            console.log('Saving category:', categoryData);

            if (editingCategory) {
                await updateCuratedCategory(editingCategory.id, categoryData);
            } else {
                const newId = await addCuratedCategory(categoryData);
                console.log('New category added with ID:', newId);
            }

            await loadAllData();
            resetCategoryForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCuratedCategory(id);
                await loadAllData();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleEditCategory = (category: CuratedCategory) => {
        setEditingCategory(category);
        setCategoryForm(category);
        setIsAddingCategory(true);
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setIsAddingCategory(false);
        setCategoryForm({
            name: '',
            description: '',
            image: '',
            href: '/men/shawls',
            order: curatedCategories.length,
        });
    };

    // ==================== FEATURED HANDLERS ====================

    const handleSaveFeatured = async () => {
        if (!featuredForm.title || !featuredForm.image || !featuredForm.href) {
            alert('Please fill in all required fields (Title, Image, Category Link)');
            return;
        }
        setIsSaving(true);

        try {
            const featuredData = {
                title: featuredForm.title || '',
                subtitle: featuredForm.subtitle || '',
                image: convertDriveLink(featuredForm.image || ''),
                href: featuredForm.href || '/men/shawls',
                span: featuredForm.span || 'medium',
                order: featuredForm.order || 0,
            };

            console.log('Saving featured:', featuredData);

            if (editingFeatured) {
                await updateFeaturedCollection(editingFeatured.id, featuredData);
            } else {
                const newId = await addFeaturedCollection(featuredData as Omit<FeaturedCollection, 'id'>);
                console.log('New featured added with ID:', newId);
            }

            await loadAllData();
            resetFeaturedForm();
        } catch (error) {
            console.error('Error saving featured:', error);
            alert('Failed to save featured collection. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteFeatured = async (id: string) => {
        if (confirm('Are you sure you want to delete this collection?')) {
            try {
                await deleteFeaturedCollection(id);
                await loadAllData();
            } catch (error) {
                console.error('Error deleting featured:', error);
            }
        }
    };

    const handleEditFeatured = (featured: FeaturedCollection) => {
        setEditingFeatured(featured);
        setFeaturedForm(featured);
        setIsAddingFeatured(true);
    };

    const resetFeaturedForm = () => {
        setEditingFeatured(null);
        setIsAddingFeatured(false);
        setFeaturedForm({
            title: '',
            subtitle: '',
            image: '',
            href: '/men/shawls',
            span: 'medium',
            order: featuredCollections.length,
        });
    };

    // ==================== SIDEBAR ====================

    const renderSidebar = () => (
        <div className="w-64 bg-charcoal text-white min-h-screen p-6 flex-shrink-0">
            <div className="mb-8">
                <h1 className="font-playfair text-xl font-bold">
                    <span className="text-gold-primary">SANDS</span> ADMIN
                </h1>
            </div>

            <nav className="space-y-2">
                {[
                    { id: 'products', icon: Package, label: 'Products' },
                    { id: 'hero', icon: ImageIcon, label: 'Hero Slides' },
                    { id: 'categories', icon: Layout, label: 'Categories' },
                    { id: 'featured', icon: Grid3X3, label: 'Featured' },
                    { id: 'newarrivals', icon: Sparkles, label: 'New Arrivals' },
                    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                    { id: 'settings', icon: Settings, label: 'Settings' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                            ? 'bg-gold-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-6 left-6">
                <a
                    href="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                    <Eye size={16} /> View Site
                </a>
            </div>
        </div>
    );

    // ==================== PRODUCTS TAB ====================

    const renderProductsTab = () => (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-charcoal">Products</h2>
                    <button
                        onClick={loadAllData}
                        className="p-2 text-medium-gray hover:text-charcoal transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-primary"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddingProduct(true)}
                        className="btn-gold flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-gold-primary" />
                </div>
            )}

            {!isLoading && (
                <div className="bg-white rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-off-white">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">Product</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">Price</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-off-white/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                {product.images[0] && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-charcoal">{product.name}</p>
                                                <div className="flex gap-2">
                                                    {product.badge && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-primary">
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                    {product.newArrival && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                                                            New Arrival
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-medium-gray">
                                        {productCategories.find((c) => c.value === product.category)?.label}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-charcoal">{formatPrice(product.salePrice || product.price)}</p>
                                            {product.salePrice && (
                                                <p className="text-xs text-medium-gray line-through">{formatPrice(product.price)}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${product.inStock
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="p-2 text-medium-gray hover:text-gold-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 text-medium-gray hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && !isLoading && (
                        <div className="py-12 text-center text-medium-gray">
                            No products found. Add your first product!
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isAddingProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-charcoal">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button onClick={resetProductForm} className="text-medium-gray hover:text-charcoal">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Product Name *</label>
                                    <input
                                        type="text"
                                        value={productForm.name || ''}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        className="input"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                                    <textarea
                                        value={productForm.description || ''}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className="input resize-none"
                                        rows={3}
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Price (PKR) *</label>
                                        <input
                                            type="number"
                                            value={productForm.price || ''}
                                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                            className="input"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Sale Price (PKR)</label>
                                        <input
                                            type="number"
                                            value={productForm.salePrice || ''}
                                            onChange={(e) =>
                                                setProductForm({
                                                    ...productForm,
                                                    salePrice: e.target.value ? Number(e.target.value) : undefined,
                                                })
                                            }
                                            className="input"
                                            placeholder="Leave empty if no sale"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Category *</label>
                                        <select
                                            value={productForm.category || ''}
                                            onChange={(e) =>
                                                setProductForm({ ...productForm, category: e.target.value as ProductCategory })
                                            }
                                            className="select"
                                        >
                                            {productCategories.map((cat) => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Badge</label>
                                        <select
                                            value={productForm.badge || ''}
                                            onChange={(e) =>
                                                setProductForm({
                                                    ...productForm,
                                                    badge: e.target.value as ProductBadge | undefined,
                                                })
                                            }
                                            className="select"
                                        >
                                            {badges.map((badge) => (
                                                <option key={badge.value} value={badge.value}>
                                                    {badge.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={productForm.images?.[0] || ''}
                                        onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                                        className="input"
                                        placeholder="Paste Google Drive sharing link or direct URL"
                                    />
                                    <p className="text-xs text-medium-gray mt-1">
                                        Paste a Google Drive sharing link - it will be automatically converted!
                                    </p>
                                    {productForm.images?.[0] && (
                                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={convertDriveLink(productForm.images[0])}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={productForm.inStock}
                                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
                                        />
                                        <span className="font-medium text-charcoal">In Stock</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={productForm.newArrival || false}
                                            onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
                                        />
                                        <span className="font-medium text-charcoal flex items-center gap-2">
                                            <Sparkles size={16} className="text-gold-primary" /> New Arrival
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-4">
                                <button onClick={resetProductForm} className="btn-outline">Cancel</button>
                                <button
                                    onClick={handleSaveProduct}
                                    className="btn-gold flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingProduct ? 'Update' : 'Save'} Product
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ==================== HERO SLIDES TAB ====================

    const renderHeroTab = () => (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-charcoal">Hero Slides</h2>
                    <button
                        onClick={loadAllData}
                        className="p-2 text-medium-gray hover:text-charcoal transition-colors"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        setSlideForm({ ...slideForm, order: heroSlides.length });
                        setIsAddingSlide(true);
                    }}
                    className="btn-gold flex items-center gap-2"
                >
                    <Plus size={18} /> Add Slide
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide) => (
                    <div key={slide.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="relative h-48">
                            <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white p-4">
                                    {slide.subtitle && <p className="text-sm opacity-80">{slide.subtitle}</p>}
                                    <h3 className="font-playfair text-xl font-bold">{slide.title}</h3>
                                </div>
                            </div>
                            <span className="absolute top-3 left-3 bg-white/90 text-charcoal px-2 py-1 rounded text-xs font-bold">
                                #{slide.order + 1}
                            </span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <span className="text-sm text-medium-gray truncate">{slide.ctaLink || 'No link'}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditSlide(slide)} className="p-2 text-medium-gray hover:text-gold-primary">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 text-medium-gray hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {heroSlides.length === 0 && !isLoading && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-medium-gray">No hero slides yet. Add your first slide!</p>
                </div>
            )}

            {/* Slide Modal */}
            <AnimatePresence>
                {isAddingSlide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
                                <button onClick={resetSlideForm}><X size={24} /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <input
                                        value={slideForm.title || ''}
                                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                        className="input"
                                        placeholder="e.g. Summer Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                                    <input
                                        value={slideForm.subtitle || ''}
                                        onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                        className="input"
                                        placeholder="e.g. New Arrivals"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={slideForm.description || ''}
                                        onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                                        className="input resize-none"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL *</label>
                                    <input
                                        value={slideForm.image || ''}
                                        onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                                        className="input"
                                        placeholder="Google Drive or direct link"
                                    />
                                    {slideForm.image && (
                                        <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                                            <Image src={convertDriveLink(slideForm.image)} alt="Preview" fill className="object-cover" sizes="400px" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Button Text</label>
                                        <input
                                            value={slideForm.ctaText || ''}
                                            onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                                            className="input"
                                            placeholder="e.g. Shop Now"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Button Link</label>
                                        <select
                                            value={slideForm.ctaLink || ''}
                                            onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
                                            className="select"
                                        >
                                            <option value="">Select a page</option>
                                            {linkOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={slideForm.order || 0}
                                        onChange={(e) => setSlideForm({ ...slideForm, order: Number(e.target.value) })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-4">
                                <button onClick={resetSlideForm} className="btn-outline">Cancel</button>
                                <button onClick={handleSaveSlide} className="btn-gold flex items-center gap-2" disabled={isSaving}>
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingSlide ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ==================== CATEGORIES TAB ====================

    const renderCategoriesTab = () => (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-charcoal">Curated Categories</h2>
                    <button onClick={loadAllData} className="p-2 text-medium-gray hover:text-charcoal">
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        setCategoryForm({ ...categoryForm, order: curatedCategories.length });
                        setIsAddingCategory(true);
                    }}
                    className="btn-gold flex items-center gap-2"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <p className="text-medium-gray text-sm mb-6">
                These categories appear on the homepage with horizontal scrolling. Add as many as you need!
            </p>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-gold-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {curatedCategories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                            <div className="relative h-32">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="200px" />
                                <span className="absolute top-2 left-2 bg-white/90 text-charcoal px-2 py-0.5 rounded text-xs font-bold">
                                    #{cat.order + 1}
                                </span>
                            </div>
                            <div className="p-3">
                                <h4 className="font-semibold text-charcoal truncate">{cat.name}</h4>
                                <p className="text-xs text-medium-gray truncate">{cat.href}</p>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => handleEditCategory(cat)} className="p-1.5 text-medium-gray hover:text-gold-primary">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-medium-gray hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {curatedCategories.length === 0 && !isLoading && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Layout size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-medium-gray">No categories yet. Add your first category!</p>
                </div>
            )}

            {/* Category Modal */}
            <AnimatePresence>
                {isAddingCategory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                                <button onClick={resetCategoryForm}><X size={24} /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Name *</label>
                                    <input
                                        value={categoryForm.name || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        className="input"
                                        placeholder="e.g. Men's Shawls"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <input
                                        value={categoryForm.description || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        className="input"
                                        placeholder="e.g. Premium Pashmina"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL *</label>
                                    <input
                                        value={categoryForm.image || ''}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                                        className="input"
                                        placeholder="Google Drive or direct link"
                                    />
                                    {categoryForm.image && (
                                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                            <Image src={convertDriveLink(categoryForm.image)} alt="Preview" fill className="object-cover" sizes="96px" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Link To Category *</label>
                                    <select
                                        value={categoryForm.href || '/men/shawls'}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, href: e.target.value })}
                                        className="select"
                                    >
                                        {linkOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={categoryForm.order || 0}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-4">
                                <button onClick={resetCategoryForm} className="btn-outline">Cancel</button>
                                <button onClick={handleSaveCategory} className="btn-gold flex items-center gap-2" disabled={isSaving}>
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingCategory ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ==================== FEATURED TAB ====================

    const renderFeaturedTab = () => (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-charcoal">Featured Collections</h2>
                    <button onClick={loadAllData} className="p-2 text-medium-gray hover:text-charcoal">
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        setFeaturedForm({ ...featuredForm, order: featuredCollections.length });
                        setIsAddingFeatured(true);
                    }}
                    className="btn-gold flex items-center gap-2"
                >
                    <Plus size={18} /> Add Collection
                </button>
            </div>

            <p className="text-medium-gray text-sm mb-6">
                Featured collections appear in a bento grid layout. Choose sizes: Small, Medium, or Large.
            </p>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-gold-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featuredCollections.map((featured) => (
                        <div key={featured.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                            <div className="relative h-32">
                                <Image src={featured.image} alt={featured.title} fill className="object-cover" sizes="200px" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{featured.title}</span>
                                </div>
                                <span className="absolute top-2 left-2 bg-white/90 text-charcoal px-2 py-0.5 rounded text-xs font-bold capitalize">
                                    {featured.span}
                                </span>
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-medium-gray truncate">{featured.href}</p>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => handleEditFeatured(featured)} className="p-1.5 text-medium-gray hover:text-gold-primary">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteFeatured(featured.id)} className="p-1.5 text-medium-gray hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {featuredCollections.length === 0 && !isLoading && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Grid3X3 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-medium-gray">No featured collections yet. Add your first!</p>
                </div>
            )}

            {/* Featured Modal */}
            <AnimatePresence>
                {isAddingFeatured && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{editingFeatured ? 'Edit Collection' : 'Add Collection'}</h3>
                                <button onClick={resetFeaturedForm}><X size={24} /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <input
                                        value={featuredForm.title || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, title: e.target.value })}
                                        className="input"
                                        placeholder="e.g. Men's Shawls"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                                    <input
                                        value={featuredForm.subtitle || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, subtitle: e.target.value })}
                                        className="input"
                                        placeholder="e.g. Premium Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL *</label>
                                    <input
                                        value={featuredForm.image || ''}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, image: e.target.value })}
                                        className="input"
                                        placeholder="Google Drive or direct link"
                                    />
                                    {featuredForm.image && (
                                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                            <Image src={convertDriveLink(featuredForm.image)} alt="Preview" fill className="object-cover" sizes="96px" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Link To Category *</label>
                                    <select
                                        value={featuredForm.href || '/men/shawls'}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, href: e.target.value })}
                                        className="select"
                                    >
                                        {linkOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Grid Size *</label>
                                    <select
                                        value={featuredForm.span || 'medium'}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, span: e.target.value as 'small' | 'medium' | 'large' })}
                                        className="select"
                                    >
                                        <option value="small">Small (1 column)</option>
                                        <option value="medium">Medium (1 column, tall)</option>
                                        <option value="large">Large (2 columns)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={featuredForm.order || 0}
                                        onChange={(e) => setFeaturedForm({ ...featuredForm, order: Number(e.target.value) })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-4">
                                <button onClick={resetFeaturedForm} className="btn-outline">Cancel</button>
                                <button onClick={handleSaveFeatured} className="btn-gold flex items-center gap-2" disabled={isSaving}>
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingFeatured ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ==================== ORDERS & SETTINGS TABS ====================

    const renderOrdersTab = () => (
        <div>
            <h2 className="text-2xl font-bold text-charcoal mb-8">Orders</h2>
            <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingCart size={28} className="text-medium-gray" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">No Orders Yet</h3>
                <p className="text-medium-gray">
                    Orders placed via WhatsApp will appear here once connected.
                </p>
            </div>
        </div>
    );

    // ==================== NEW ARRIVAL SHOWCASE HANDLERS ====================

    const handleSaveShowcase = async () => {
        if (!showcaseForm.media || !showcaseForm.linkedProductId) {
            alert('Please fill in Media URL and select a linked product');
            return;
        }
        setIsSaving(true);

        try {
            const showcaseData = {
                media: convertDriveLink(showcaseForm.media || ''),
                mediaType: showcaseForm.mediaType || 'image',
                linkedProductId: showcaseForm.linkedProductId || '',
                title: showcaseForm.title || '',
                order: showcaseForm.order || 0,
            };

            if (editingShowcase) {
                await updateNewArrivalShowcase(editingShowcase.id, showcaseData);
            } else {
                await addNewArrivalShowcase(showcaseData as Omit<NewArrivalShowcase, 'id' | 'createdAt' | 'updatedAt'>);
            }

            await loadAllData();
            resetShowcaseForm();
        } catch (error) {
            console.error('Error saving showcase:', error);
            alert('Failed to save showcase. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteShowcase = async (id: string) => {
        if (confirm('Are you sure you want to delete this showcase?')) {
            try {
                await deleteNewArrivalShowcase(id);
                await loadAllData();
            } catch (error) {
                console.error('Error deleting showcase:', error);
            }
        }
    };

    const handleEditShowcase = (showcase: NewArrivalShowcase) => {
        setEditingShowcase(showcase);
        setShowcaseForm(showcase);
        setIsAddingShowcase(true);
    };

    const resetShowcaseForm = () => {
        setEditingShowcase(null);
        setIsAddingShowcase(false);
        setShowcaseForm({
            media: '',
            mediaType: 'image',
            linkedProductId: '',
            title: '',
            order: newArrivalShowcases.length,
        });
    };

    // ==================== NEW ARRIVALS TAB ====================

    const renderNewArrivalsTab = () => (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-charcoal">New Arrivals Showcase</h2>
                    <button
                        onClick={loadAllData}
                        className="p-2 text-medium-gray hover:text-charcoal transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <button
                    onClick={() => setIsAddingShowcase(true)}
                    className="btn-gold flex items-center gap-2"
                >
                    <Plus size={18} /> Add Showcase Item
                </button>
            </div>

            <p className="text-medium-gray mb-6">
                Add images or videos of your products and link them to their product pages. Customers will see a &quot;Go to Product&quot; button.
            </p>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-gold-primary" />
                </div>
            )}

            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newArrivalShowcases.map((showcase) => {
                        const linkedProduct = products.find(p => p.id === showcase.linkedProductId);
                        return (
                            <div key={showcase.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="relative h-48 bg-gray-100">
                                    {showcase.mediaType === 'video' ? (
                                        <video
                                            src={showcase.media}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                        />
                                    ) : (
                                        <Image
                                            src={showcase.media}
                                            alt={showcase.title || 'Showcase'}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${showcase.mediaType === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {showcase.mediaType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {showcase.title && (
                                        <h3 className="font-medium text-charcoal mb-1">{showcase.title}</h3>
                                    )}
                                    <p className="text-sm text-medium-gray mb-3">
                                        Linked to: {linkedProduct?.name || 'Unknown Product'}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-medium-gray">Order: {showcase.order}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditShowcase(showcase)}
                                                className="p-2 text-medium-gray hover:text-gold-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteShowcase(showcase.id)}
                                                className="p-2 text-medium-gray hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {newArrivalShowcases.length === 0 && !isLoading && (
                        <div className="col-span-full py-12 text-center text-medium-gray bg-white rounded-xl">
                            No showcase items yet. Add your first item!
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Showcase Modal */}
            <AnimatePresence>
                {isAddingShowcase && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-charcoal">
                                    {editingShowcase ? 'Edit Showcase' : 'Add New Showcase'}
                                </h3>
                                <button onClick={resetShowcaseForm} className="text-medium-gray hover:text-charcoal">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Media URL *</label>
                                    <input
                                        type="url"
                                        value={showcaseForm.media || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, media: e.target.value })}
                                        className="input"
                                        placeholder="Paste Google Drive sharing link"
                                    />
                                    <p className="text-xs text-medium-gray mt-1">
                                        Paste a Google Drive sharing link for image or video
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Media Type *</label>
                                    <select
                                        value={showcaseForm.mediaType || 'image'}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, mediaType: e.target.value as 'image' | 'video' })}
                                        className="select"
                                    >
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Link to Product *</label>
                                    <select
                                        value={showcaseForm.linkedProductId || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, linkedProductId: e.target.value })}
                                        className="select"
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} ({productCategories.find(c => c.value === product.category)?.label})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-medium-gray mt-1">
                                        When clicked, customers will be taken to this product page
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Custom Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={showcaseForm.title || ''}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
                                        className="input"
                                        placeholder="Leave empty to use product name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={showcaseForm.order || 0}
                                        onChange={(e) => setShowcaseForm({ ...showcaseForm, order: Number(e.target.value) })}
                                        className="input"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-4">
                                <button onClick={resetShowcaseForm} className="btn-outline">Cancel</button>
                                <button
                                    onClick={handleSaveShowcase}
                                    className="btn-gold flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingShowcase ? 'Update' : 'Add'} Showcase
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderSettingsTab = () => (
        <div>
            <h2 className="text-2xl font-bold text-charcoal mb-8">Settings</h2>
            <div className="bg-white rounded-xl p-6 max-w-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Store Name</label>
                    <input type="text" defaultValue="Sands Collections" className="input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp Number</label>
                    <input type="tel" defaultValue="+923066166152" className="input" />
                    <p className="text-xs text-medium-gray mt-1">Order notifications will be sent to this number</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Fixed Shipping Cost (PKR)</label>
                    <input type="number" defaultValue={250} className="input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Free Shipping Threshold (PKR)</label>
                    <input type="number" defaultValue={5000} className="input" />
                </div>
                <button className="btn-gold flex items-center gap-2">
                    <Save size={18} /> Save Settings
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-off-white">
            {renderSidebar()}

            <main className="flex-1 p-8">
                {activeTab === 'products' && renderProductsTab()}
                {activeTab === 'hero' && renderHeroTab()}
                {activeTab === 'categories' && renderCategoriesTab()}
                {activeTab === 'featured' && renderFeaturedTab()}
                {activeTab === 'newarrivals' && renderNewArrivalsTab()}
                {activeTab === 'orders' && renderOrdersTab()}
                {activeTab === 'settings' && renderSettingsTab()}
            </main>
        </div>
    );
}
