// TypeScript interfaces for Sands Collections e-commerce

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: ProductCategory;
    subcategory?: string;
    sizes?: string[];
    colors?: string[];
    material?: string;
    inStock: boolean;
    stockQuantity?: number;
    badge?: ProductBadge;
    featured?: boolean;
    newArrival?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductCategory =
    | 'mens-shawls'
    | 'mens-unstitched-suiting'
    | 'womens-shawls'
    | 'womens-duppattas'
    | 'fragrances-mens'
    | 'fragrances-womens'
    | 'fragrances-unisex'
    | 'ihram-ladies'
    | 'ihram-gents';

export interface ProductSize {
    name: string;
    available: boolean;
}

export interface ProductColor {
    name: string;
    hex: string;
    available: boolean;
}

export type ProductBadge = 'best-seller' | 'new-arrival' | 'limited-stock' | 'sale';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    customer: CustomerInfo;
    status: OrderStatus;
    totalAmount: number;
    shippingCost: number;
    paymentMethod: 'cod';
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerInfo {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    notes?: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export interface HeroSlide {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
}

// Curated Category for homepage horizontal scrolling section
export interface CuratedCategory {
    id: string;
    name: string;
    description?: string;
    image: string;
    href: string;
    order: number;
}

// Featured Collection for bento grid on homepage
export interface FeaturedCollection {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    href: string;
    span: 'small' | 'medium' | 'large';
    order: number;
}

// New Arrival Showcase for admin-managed homepage section
export interface NewArrivalShowcase {
    id: string;
    media: string;              // Google Drive image/video URL
    mediaType: 'image' | 'video';
    linkedProductId: string;    // Reference to Product.id
    title?: string;             // Optional custom title
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

export interface SiteSettings {
    storeName: string;
    whatsappNumber: string;
    email: string;
    address: string;
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
    shippingCost: number;
    freeShippingThreshold?: number;
}

// Filter types for product listing pages
export interface ProductFilters {
    category?: ProductCategory;
    subcategory?: string;
    priceRange?: [number, number];
    inStock?: boolean;
    material?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}
