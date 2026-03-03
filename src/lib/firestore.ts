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
    setDoc,
    increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, ProductCategory, HeroSlide, SiteSettings, CuratedCategory, FeaturedCollection, NewArrivalShowcase, ContactMessage } from './types';

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

        // Only add orderBy if not filtering by newArrival (to avoid composite index requirement)
        // We'll sort client-side when filtering
        const needsClientSort = filters?.newArrival || filters?.featured;
        if (!needsClientSort) {
            constraints.push(orderBy('createdAt', 'desc'));
        }

        if (filters?.limitCount && !needsClientSort) {
            constraints.push(limit(filters.limitCount));
        }

        const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
        const snapshot = await getDocs(q);

        let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Product[];

        // Sort client-side if we didn't use orderBy
        if (needsClientSort) {
            products.sort((a, b) => {
                const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                return dateB - dateA;
            });

            // Apply limit client-side
            if (filters?.limitCount) {
                products = products.slice(0, filters.limitCount);
            }
        }

        return products;
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

// Seed Featured Collections with updated Men's/Women's Collection links
export async function seedFeaturedCollections(): Promise<boolean> {
    try {
        console.log('Starting Featured Collections Seeding...');

        // 1. Delete all existing featured collections
        const existingSnapshot = await getDocs(collection(db, FEATURED_COLLECTION));
        const batchDelete = writeBatch(db);
        existingSnapshot.docs.forEach((docItem) => {
            batchDelete.delete(docItem.ref);
        });
        await batchDelete.commit();
        console.log('Cleared existing featured collections.');

        // 2. Create new featured collections with updated links
        const featuredToCreate = [
            {
                title: "Men's Collection",
                subtitle: 'Shawls & Suiting',
                image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800',
                href: '/men',
                span: 'large',
                order: 0,
            },
            {
                title: 'Fragrances',
                subtitle: 'Signature Scents',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
                href: '/fragrances',
                span: 'medium',
                order: 1,
            },
            {
                title: 'Ihram',
                subtitle: 'Sacred Garments',
                image: 'https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=600',
                href: '/ihram',
                span: 'medium',
                order: 2,
            },
            {
                title: "Women's Collection",
                subtitle: 'Shawls & Duppattas',
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
                href: '/women',
                span: 'large',
                order: 3,
            },
        ];

        // 3. Add to database
        const batch = writeBatch(db);
        featuredToCreate.forEach((featured) => {
            const newDocRef = doc(collection(db, FEATURED_COLLECTION));
            batch.set(newDocRef, featured);
        });
        await batch.commit();

        console.log(`Successfully seeded ${featuredToCreate.length} featured collections.`);
        return true;
    } catch (error) {
        console.error('Error seeding featured collections:', error);
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

// Seed New Arrival Showcases with default data linked to actual products
export async function seedNewArrivals(): Promise<boolean> {
    try {
        console.log('Starting New Arrivals Seeding...');

        // 1. Delete all existing showcases
        const existingSnapshot = await getDocs(collection(db, NEW_ARRIVALS_COLLECTION));
        const batchDelete = writeBatch(db);
        existingSnapshot.docs.forEach((docItem) => {
            batchDelete.delete(docItem.ref);
        });
        await batchDelete.commit();
        console.log('Cleared existing showcases.');

        // 2. Fetch products to link showcases to
        const products = await getProducts();
        if (products.length === 0) {
            console.error('No products found to link showcases to.');
            return false;
        }

        // Helper to find a product by category or name keyword
        const findProduct = (categoryKeyword: string, nameKeyword?: string) => {
            let found = products.find(p =>
                p.category.includes(categoryKeyword) &&
                (nameKeyword ? p.name.toLowerCase().includes(nameKeyword.toLowerCase()) : true)
            );
            if (!found) {
                found = products.find(p => p.category.includes(categoryKeyword));
            }
            return found || products[0];
        };

        // 3. Create 6 showcases linked to real products
        const showcasesToCreate = [
            {
                media: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('mens-shawls', 'pashmina').id,
                title: 'Premium Pashmina Collection',
                order: 0,
            },
            {
                media: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('mens-shawls', 'wool').id,
                title: 'Elegant Shawls',
                order: 1,
            },
            {
                media: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('fragrances', 'oud').id,
                title: 'Exclusive Fragrances',
                order: 2,
            },
            {
                media: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('mens-unstitched-suiting').id,
                title: 'Suiting Collection',
                order: 3,
            },
            {
                media: 'https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('womens-duppattas').id,
                title: 'Dupatta Collection',
                order: 4,
            },
            {
                media: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000',
                mediaType: 'image' as const,
                linkedProductId: findProduct('womens-shawls', 'rose').id,
                title: "Women's Shawls",
                order: 5,
            },
        ];

        // 4. Add showcases to database
        const batch = writeBatch(db);
        showcasesToCreate.forEach((showcase) => {
            const newDocRef = doc(collection(db, NEW_ARRIVALS_COLLECTION));
            batch.set(newDocRef, {
                ...showcase,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        });
        await batch.commit();

        console.log(`Successfully seeded ${showcasesToCreate.length} New Arrival showcases.`);
        return true;
    } catch (error) {
        console.error('Error seeding new arrivals:', error);
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

// ==========================================
// REVIEWS
// ==========================================

const REVIEWS_COLLECTION = 'reviews';

export async function getReviews(productId?: string): Promise<Review[]> {
    try {
        const constraints: QueryConstraint[] = [];

        if (productId) {
            constraints.push(where('productId', '==', productId));
        }

        constraints.push(orderBy('createdAt', 'desc'));

        const q = query(collection(db, REVIEWS_COLLECTION), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Review[];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            ...review,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding review:', error);
        return null;
    }
}

export async function deleteReview(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        return false;
    }
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<boolean> {
    try {
        const docRef = doc(db, REVIEWS_COLLECTION, id);
        await updateDoc(docRef, updates);
        return true;
    } catch (error) {
        console.error('Error updating review:', error);
        return false;
    }
}

// SEEDING SCRIPT
import { writeBatch } from 'firebase/firestore';
import { Review } from './types'; // Ensure Review is imported

export async function seedReviews(): Promise<boolean> {
    try {
        console.log('Starting Review Seeding...');

        // 1. Delete all existing reviews
        const existingSnapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
        const batchDelete = writeBatch(db);
        existingSnapshot.docs.forEach((doc) => {
            batchDelete.delete(doc.ref);
        });
        await batchDelete.commit();
        console.log('Cleared existing reviews.');

        // 2. Fetch Products to assign reviews to
        const products = await getProducts();
        if (products.length === 0) {
            console.error('No products found to assign reviews to.');
            return false;
        }

        // 3. Generate 124 Reviews
        const reviewsToCreate: Omit<Review, 'id'>[] = [];
        const distribution = { 5: 90, 4: 24, 3: 10 };

        // 80+ Random Pakistani names (no celebrities, everyday names)
        const pakistaniNames = [
            // Male Names
            'Kamran Ashraf', 'Nadeem Malik', 'Imran Qureshi', 'Waqar Hussain', 'Rashid Mahmood',
            'Zahid Iqbal', 'Arif Khan', 'Khalid Mehmood', 'Tariq Aziz', 'Naveed Ahmed',
            'Faisal Rauf', 'Adnan Siddiqui', 'Mohsin Ali', 'Junaid Hassan', 'Salman Rafiq',
            'Amir Shahzad', 'Irfan Bashir', 'Shahbaz Gill', 'Naeem Butt', 'Asad Mirza',
            'Furqan Javed', 'Hamid Rana', 'Waseem Akbar', 'Bilal Riaz', 'Farhan Saeed',
            'Aqeel Abbasi', 'Sajid Nawaz', 'Tanveer Aslam', 'Shafiq Rehman', 'Mazhar Abbas',
            'Zubair Ghouri', 'Rehan Chaudhry', 'Pervaiz Elahi', 'Kashif Anwar', 'Manzoor Ahmad',
            'Sabir Hussain', 'Ghulam Mustafa', 'Jameel Akhtar', 'Noman Ejaz', 'Shakeel Butt',
            // Female Names
            'Tahira Begum', 'Rubina Khatoon', 'Asma Farooq', 'Samina Bibi', 'Bushra Perveen',
            'Nazia Batool', 'Shabana Gul', 'Saima Akhtar', 'Farzana Naz', 'Uzma Rashid',
            'Razia Sultana', 'Kausar Parveen', 'Nasreen Akhtar', 'Shagufta Jabeen', 'Rukhsana Bibi',
            'Parveen Akhtar', 'Salma Begum', 'Firdous Bano', 'Ghazala Noor', 'Mehwish Hayat',
            'Iqra Aziz', 'Hina Sultan', 'Amina Tariq', 'Zareena Malik', 'Nighat Aslam',
            'Rehana Yasmeen', 'Abida Parveen', 'Sughra Bibi', 'Nusrat Fatima', 'Kishwar Naheed',
            'Zakia Masood', 'Meher Bano', 'Shamim Ara', 'Zubaida Begum', 'Tabassum Riaz',
            'Naseem Akhtar', 'Saadia Afzal', 'Farida Khanum', 'Yasmeen Shah', 'Rabia Butt',
            // Mixed variations
            'M. Akram', 'S. Kamal', 'A. Rehman', 'Haji Bashir', 'Ch. Nazir', 'Malik Asghar'
        ];

        // 50+ Roman Urdu 5-Star Reviews (Authentic Pakistani style)
        const romanUrdu5Star = [
            "Masha Allah bohat zabardast quality hai, bilkul expectations se barh kar mila",
            "Bahut hi shandar product mila, packing bhi behtareen thi, shukriya",
            "Sach mein premium quality hai, dil khush ho gaya order dekh k",
            "Delivery time perfect, product original, full marks deta hun",
            "Pehle online shopping se darta tha lekin ye store trustworthy hai",
            "Bohat pyara piece aya hai, ghar walo ko bhi bohat pasand aya",
            "Fabric ki quality lajawab hai, price k hisab se bohat acha deal mila",
            "Next time phir yahi se order karunga InshaAllah, highly recommended",
            "Color bilkul pic jaisa aya, size bhi perfect fit hua",
            "Customer care bohat helpful hai, response time bhi acha hai",
            "Gift k liye lia tha, receiver bohat khush hua, thank you Sands",
            "Kapre ka material premium lagta hai, stitching bhi neat hai",
            "Eid k liye order kia tha, time pe mil gaya AlhamduliLlah",
            "Ye mera teesra order hai, kabhi disappoint nahi kiya",
            "Mehngi cheez hai lekin quality k liye paisa worth it hai",
            "Bohat satisfied hun, return customer ban gaya hun main",
            "Shawl ki warmth zabardast hai, kashmiri feel aata hai",
            "Original product mila, fake nahi hai, verified buyer hun",
            "Packaging itni premium thi k gift wrap ki zaroorat nahi pari",
            "Doston ko bhi recommend kar dia hai, sab ne order kia",
            "Fragrance bohat subtle hai, pure day rehti hai, loved it",
            "Material breathable hai, summer mein bhi comfortable hai",
            "Embroidery ka kaam bohat fine hai, hand work lagta hai",
            "Delivery boy ne proper handle kia, crease bhi nahi aya",
            "Exchange process bhi easy hai, no hassle return policy",
            "Website pe jo dikhaya wahi mila, koi cheating nahi",
            "Affordable price mein premium quality, rare combination hai",
            "Lahore mein next day delivery mil gayi, impressed hun",
            "Mummy k liye lia tha, unko bohat pasand aya, happy customer",
            "Ye brand fake nahi bechta, verified ho k order karo",
            "Itni soft fabric pehle nahi dekhi, skin k sath comfortable hai",
            "Winter collection bohat acha hai, variety bhi achi hai",
            "Payment methods easy hain, COD available hai jo plus point hai",
            "WhatsApp pe baat ki, bohat polite staff hai",
            "Trustworthy store hai, scam nahi hai, order karo without fear",
            "Product photos se bhi better nikla asli mein",
            "Repeat order hai, pehle bhi yehi quality mili thi",
            "JazakAllah for genuine products, rare hai ye Pakistani market mein",
            "Suit ka fabric bohat acha hai, tailor bhi praise kar raha tha",
            "Stitched products bhi available hain jo convenient hai",
            "Bhai k liye shawl lia, usne bohat tarif ki quality ki",
            "Premium feel ata hai product mein, cheap nahi lagta",
            "Fast delivery, original product, 5 stars deserve karta hai",
            "Bohat carefully packed tha, koi damage nahi tha",
            "Ye store recommend karta hun sabko, fraud nahi hai",
            "Affordable luxury mil gayi, bohot khush hun",
            "Dupatta bohat elegant hai, function mein compliments mile",
            "Ihram ki quality soft hai, Umrah k liye perfect hai",
            "Perfume ki khushboo long lasting hai, value for money",
            "First order tha aur experience acha raha, will order again"
        ];

        // 20+ Roman Urdu 4-Star Reviews
        const romanUrdu4Star = [
            "Product achi hai, bas shipping thori late ho gayi thi",
            "Quality mast hai, color thora different hai pics se lekin okay hai",
            "Cheez achi mili lekin packaging behtar ho sakti thi thori",
            "Overall good experience, size chart confusing thi bas",
            "Recommended hai, but price thori zyada hai market se",
            "Fabric acha hai, design bhi pyara hai, minor issues hain",
            "Liked it, bas delivery mein 2 din extra lag gaye",
            "Sahi hai product, customer service thori slow thi",
            "Material acha hai, bas ironing ki zaroorat pari",
            "Good quality mil gayi, bas exchange process lengthy tha",
            "Shawl achi hai, bas color shade thora dark tha",
            "Product genuine hai, communication improve ho sakti hai",
            "Paise ka worth hai, 4 stars isliye k ek button missing tha",
            "Suit acha aya, lekin salwar ka fit thora loose tha",
            "Fragrance achi hai, bas bottle thori choti thi",
            "Order track karna mushkil tha, product theek aya",
            "Quality premium hai, bass COD charges extra lage the",
            "Achi cheez hai, next time size chart dekh k order karunga",
            "Liked the product, packaging could be more eco-friendly",
            "Good value, minor delay in shipping but worth it"
        ];

        // 15+ Roman Urdu 3-Star Reviews
        const romanUrdu3Star = [
            "Thik hai bas, bohat khaas nahi laga mujhe honestly",
            "Delivery bohat late thi, hafte lag gaye",
            "Pic me color different lag raha tha, thora disappointed",
            "Quality okay hai, extra ordinary nahi hai yaar",
            "Average product hai, isse behtar mil sakta tha",
            "Price thori zyada hai quality k hisab se frankly",
            "Guzara hai, kaam chal jayega abhi k liye",
            "Not bad but expected better at this price point",
            "Thik hai, use ho jayega, nothing special",
            "Material average hai, premium nahi lagta",
            "Size issue tha, exchange ki request pending hai",
            "Product okay hai, photos se thora different mila",
            "Theek hai, ek do jagah stitching loose thi",
            "Expected more for the price, average quality",
            "Ordinary hai, kuch special nahi hai ismein"
        ];

        // 12 Pure Urdu Script Reviews (Mix of ratings)
        const urduScriptReviews = [
            { comment: "ماشاءاللہ بہت عمدہ کوالٹی ہے، پیکنگ بھی زبردست تھی", rating: 5 },
            { comment: "بہت اچھی چیز ہے، سب کو پسند آئی، شکریہ", rating: 5 },
            { comment: "ڈلیوری وقت پر ملی، پروڈکٹ اصلی تھا", rating: 5 },
            { comment: "بہترین شال ہے، سردیوں کے لیے بالکل ٹھیک", rating: 5 },
            { comment: "قیمت کے حساب سے بہت اچھا سودا ہے", rating: 5 },
            { comment: "پہلی بار آرڈر کیا، تجربہ اچھا رہا الحمدللہ", rating: 5 },
            { comment: "خوشبو بہت پیاری ہے، دیر تک رہتی ہے", rating: 5 },
            { comment: "کپڑے کی کوالٹی اچھی ہے، رنگ بھی ٹھیک ہے", rating: 4 },
            { comment: "چیز ٹھیک ہے، ڈلیوری میں تھوڑی دیر ہوئی", rating: 4 },
            { comment: "اچھا ہے لیکن قیمت تھوڑی زیادہ لگی", rating: 4 },
            { comment: "ٹھیک ہے، توقع سے کم تھا صادقانہ طور پر", rating: 3 },
            { comment: "اوسط کوالٹی ہے، بہت خاص نہیں", rating: 3 }
        ];

        const generateReview = (rating: number, specificComment?: string): Omit<Review, 'id'> => {
            const product = products[Math.floor(Math.random() * products.length)];
            const name = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];

            let comment = specificComment;
            if (!comment) {
                let commentsPool = romanUrdu5Star;
                if (rating === 4) commentsPool = romanUrdu4Star;
                if (rating === 3) commentsPool = romanUrdu3Star;
                comment = commentsPool[Math.floor(Math.random() * commentsPool.length)];
            }

            // Random date within last 6 months
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 180));

            return {
                productId: product.id,
                productName: product.name,
                userName: name,
                rating: rating,
                comment: comment,
                date: date.toISOString().split('T')[0], // YYYY-MM-DD
                verified: Math.random() > 0.3, // 70% verified
                createdAt: date
            };
        };

        // Create reviews array - First add the Urdu script reviews
        urduScriptReviews.forEach(ur => {
            reviewsToCreate.push(generateReview(ur.rating, ur.comment));
        });

        // Then generate remaining reviews to reach 124 total
        // We have 12 Urdu reviews, need: 90-7=83 five-star, 24-3=21 four-star, 10-2=8 three-star
        const remaining5Star = distribution[5] - 7; // 7 Urdu 5-star reviews
        const remaining4Star = distribution[4] - 3; // 3 Urdu 4-star reviews  
        const remaining3Star = distribution[3] - 2; // 2 Urdu 3-star reviews

        for (let i = 0; i < remaining5Star; i++) reviewsToCreate.push(generateReview(5));
        for (let i = 0; i < remaining4Star; i++) reviewsToCreate.push(generateReview(4));
        for (let i = 0; i < remaining3Star; i++) reviewsToCreate.push(generateReview(3));

        // Shuffle the reviews array
        for (let i = reviewsToCreate.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [reviewsToCreate[i], reviewsToCreate[j]] = [reviewsToCreate[j], reviewsToCreate[i]];
        }

        // Start Batch Writes
        const chunkSize = 100;
        for (let i = 0; i < reviewsToCreate.length; i += chunkSize) {
            const chunk = reviewsToCreate.slice(i, i + chunkSize);
            const batch = writeBatch(db);
            chunk.forEach((rev) => {
                const newDocRef = doc(collection(db, REVIEWS_COLLECTION));
                batch.set(newDocRef, rev);
            });
            await batch.commit();
        }

        console.log(`Successfully seeded ${reviewsToCreate.length} reviews.`);
        return true;
    } catch (error) {
        console.error('Error seeding reviews:', error);
        return false;
    }
}


// ==========================================
// STATS / ANALYTICS
// ==========================================

const STATS_DOC = 'stats/general';

export interface StoreStats {
    totalRevenue?: number; // Maintained for backward compatibility or future use
    totalCheckouts: number;
    totalVisits: number;
    activeUsersToday: number; // Reset daily via scheduled function (or manual logic)
}

export async function getStoreStats(): Promise<StoreStats> {
    try {
        const docRef = doc(db, STATS_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as StoreStats;
        } else {
            // Initialize if not exists
            const initialStats: StoreStats = {
                totalCheckouts: 0,
                totalVisits: 0,
                activeUsersToday: 0
            };
            await setDoc(docRef, initialStats);
            return initialStats;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { totalCheckouts: 0, totalVisits: 0, activeUsersToday: 0 };
    }
}

// Atomic Increments
export async function incrementCheckout() {
    try {
        const docRef = doc(db, STATS_DOC);
        // Use merge to safe create
        await setDoc(docRef, { totalCheckouts: increment(1) }, { merge: true });
    } catch (error) {
        console.error('Error incrementing checkout:', error);
    }
}

export async function incrementVisit(isNewDailyUser: boolean = false) {
    try {
        const docRef = doc(db, STATS_DOC);
        const updates: any = { totalVisits: increment(1) };
        if (isNewDailyUser) {
            updates.activeUsersToday = increment(1);
        }
        await setDoc(docRef, updates, { merge: true });
    } catch (error) {
        console.error('Error incrementing visit:', error);
    }
}

export async function getActiveProductsCount(): Promise<number> {
    try {
        // Query for inStock products. 
        // Note: For large datasets, count() aggregation is better, but this works for now.
        const q = query(collection(db, PRODUCTS_COLLECTION), where('inStock', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error('Error counting active products:', error);
        return 0;
    }
}

// ==========================================
// CONTACT MESSAGES
// ==========================================

const CONTACT_MESSAGES_COLLECTION = 'contactMessages';

// Get all contact messages
export async function getContactMessages(): Promise<ContactMessage[]> {
    try {
        const q = query(
            collection(db, CONTACT_MESSAGES_COLLECTION),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: data.status || 'new',
                createdAt: data.createdAt?.toDate() || new Date(),
                repliedAt: data.repliedAt?.toDate(),
            } as ContactMessage;
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return [];
    }
}

// Add new contact message
export async function addContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
            ...messageData,
            status: 'new',
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding contact message:', error);
        return null;
    }
}

// Update contact message status
export async function updateContactMessageStatus(
    messageId: string,
    status: 'new' | 'read' | 'replied'
): Promise<boolean> {
    try {
        const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
        const updates: any = { status };
        if (status === 'replied') {
            updates.repliedAt = Timestamp.now();
        }
        await updateDoc(docRef, updates);
        return true;
    } catch (error) {
        console.error('Error updating contact message status:', error);
        return false;
    }
}

// Delete contact message
export async function deleteContactMessage(messageId: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, CONTACT_MESSAGES_COLLECTION, messageId));
        return true;
    } catch (error) {
        console.error('Error deleting contact message:', error);
        return false;
    }
}

// Get unread messages count
export async function getUnreadMessagesCount(): Promise<number> {
    try {
        const q = query(
            collection(db, CONTACT_MESSAGES_COLLECTION),
            where('status', '==', 'new')
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return 0;
    }
}
