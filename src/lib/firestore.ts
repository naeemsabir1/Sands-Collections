// Firestore Service Functions for Sands Collections
// CRUD operations for Products, Orders, and Settings

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    DocumentData,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, ProductCategory, HeroSlide, SiteSettings, CuratedCategory, FeaturedCollection, NewArrivalShowcase } from './types';

// ==========================================
// PRODUCTS
// ==========================================

const PRODUCTS_COLLECTION = 'products';

// Get all products
export async function getProducts(filters?: {
    category?: ProductCategory;
    featured?: boolean;
    newArrival?: boolean;
    limitCount?: number;
}): Promise<Product[]> {
    try {
        const constraints: QueryConstraint[] = [];

        if (filters?.category) {
            constraints.push(where('category', '==', filters.category));
        }
        if (filters?.featured) {
            constraints.push(where('featured', '==', true));
        }
        if (filters?.newArrival) {
            constraints.push(where('newArrival', '==', true));
        }

        constraints.push(orderBy('createdAt', 'desc'));

        if (filters?.limitCount) {
            constraints.push(limit(filters.limitCount));
        }

        const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...convertTimestamps(docSnap.data()),
            } as Product;
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Get products by category
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return getProducts({ category });
}

// Add new product
export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
            ...product,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

// Update product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// ==========================================
// ORDERS
// ==========================================

const ORDERS_COLLECTION = 'orders';

// Get all orders
export async function getOrders(): Promise<Order[]> {
    try {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Order[];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Get single order
export async function getOrderById(id: string): Promise<Order | null> {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...convertTimestamps(docSnap.data()),
            } as Order;
        }
        return null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

// Create order
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
            ...order,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

// Update order status
export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, id);
        await updateDoc(docRef, {
            status,
            updatedAt: Timestamp.now(),
        });
        return true;
    } catch (error) {
        console.error('Error updating order:', error);
        return false;
    }
}

// ==========================================
// HERO SLIDES
// ==========================================

const HERO_SLIDES_COLLECTION = 'heroSlides';

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        const q = query(collection(db, HERO_SLIDES_COLLECTION), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as HeroSlide[];
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
}

export async function addHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, HERO_SLIDES_COLLECTION), slide);
        return docRef.id;
    } catch (error) {
        console.error('Error adding hero slide:', error);
        return null;
    }
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<boolean> {
    try {
        await updateDoc(doc(db, HERO_SLIDES_COLLECTION, id), updates);
        return true;
    } catch (error) {
        console.error('Error updating hero slide:', error);
        return false;
    }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, HERO_SLIDES_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting hero slide:', error);
        return false;
    }
}

// ==========================================
// CURATED CATEGORIES
// ==========================================

const CATEGORIES_COLLECTION = 'curatedCategories';

export async function getCuratedCategories(): Promise<CuratedCategory[]> {
    try {
        // Fetch without orderBy to avoid index requirement, sort client-side
        const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CuratedCategory[];

        // Sort by order field client-side
        return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching curated categories:', error);
        return [];
    }
}

export async function addCuratedCategory(category: Omit<CuratedCategory, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
        return docRef.id;
    } catch (error) {
        console.error('Error adding curated category:', error);
        return null;
    }
}

export async function updateCuratedCategory(id: string, updates: Partial<CuratedCategory>): Promise<boolean> {
    try {
        await updateDoc(doc(db, CATEGORIES_COLLECTION, id), updates);
        return true;
    } catch (error) {
        console.error('Error updating curated category:', error);
        return false;
    }
}

export async function deleteCuratedCategory(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting curated category:', error);
        return false;
    }
}

// ==========================================
// FEATURED COLLECTIONS
// ==========================================

const FEATURED_COLLECTION = 'featuredCollections';

export async function getFeaturedCollections(): Promise<FeaturedCollection[]> {
    try {
        // Fetch without orderBy to avoid index requirement, sort client-side
        const snapshot = await getDocs(collection(db, FEATURED_COLLECTION));
        const collections = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as FeaturedCollection[];

        // Sort by order field client-side
        return collections.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching featured collections:', error);
        return [];
    }
}

export async function addFeaturedCollection(featured: Omit<FeaturedCollection, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, FEATURED_COLLECTION), featured);
        return docRef.id;
    } catch (error) {
        console.error('Error adding featured collection:', error);
        return null;
    }
}

export async function updateFeaturedCollection(id: string, updates: Partial<FeaturedCollection>): Promise<boolean> {
    try {
        await updateDoc(doc(db, FEATURED_COLLECTION, id), updates);
        return true;
    } catch (error) {
        console.error('Error updating featured collection:', error);
        return false;
    }
}

export async function deleteFeaturedCollection(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, FEATURED_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting featured collection:', error);
        return false;
    }
}

// ==========================================
// NEW ARRIVAL SHOWCASES
// ==========================================

const NEW_ARRIVALS_COLLECTION = 'newArrivalShowcases';

export async function getNewArrivalShowcases(): Promise<NewArrivalShowcase[]> {
    try {
        const snapshot = await getDocs(collection(db, NEW_ARRIVALS_COLLECTION));
        const showcases = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as NewArrivalShowcase[];

        return showcases.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching new arrival showcases:', error);
        return [];
    }
}

export async function addNewArrivalShowcase(showcase: Omit<NewArrivalShowcase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, NEW_ARRIVALS_COLLECTION), {
            ...showcase,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding new arrival showcase:', error);
        return null;
    }
}

export async function updateNewArrivalShowcase(id: string, updates: Partial<NewArrivalShowcase>): Promise<boolean> {
    try {
        await updateDoc(doc(db, NEW_ARRIVALS_COLLECTION, id), {
            ...updates,
            updatedAt: Timestamp.now(),
        });
        return true;
    } catch (error) {
        console.error('Error updating new arrival showcase:', error);
        return false;
    }
}

export async function deleteNewArrivalShowcase(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, NEW_ARRIVALS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting new arrival showcase:', error);
        return false;
    }
}

// ==========================================
// SITE SETTINGS
// ==========================================

const SETTINGS_DOC = 'settings/main';

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const docRef = doc(db, SETTINGS_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings;
        }
        return null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
    try {
        await updateDoc(doc(db, SETTINGS_DOC), settings);
        return true;
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Convert Firestore Timestamps to JS Dates
function convertTimestamps(data: DocumentData): DocumentData {
    const result = { ...data };

    if (result.createdAt instanceof Timestamp) {
        result.createdAt = result.createdAt.toDate();
    }
    if (result.updatedAt instanceof Timestamp) {
        result.updatedAt = result.updatedAt.toDate();
    }

    return result;
}
