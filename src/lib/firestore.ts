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

        const pakistaniNames = [
            'Muhammad Ahmed', 'Fatima Bibi', 'Zainab Khan', 'Ali Raza', 'Sara Malik', 'Usman Gondal',
            'Ayesha Siddiqui', 'Bilal Sheikh', 'Hassan Javid', 'Marium Tariq', 'Hamza Yousaf', 'Sadia Parveen',
            'Omer Farooq', 'Khadija Noor', 'Ahsan Iqbal', 'Sana Mir', 'Rizwan Ahmed', 'Hira Mani', 'Fahad Mustafa',
            'Mahira Khan', 'Atif Aslam', 'Sajal Aly', 'Bilal Abbas', 'Yumna Zaidi', 'Ahmed Ali', 'Zara Noor',
            'Saim Ali', 'Nashit Begum', 'Tariq Jameel', 'Wasim Akram', 'Shoaib Akhtar', 'Shahid Afridi', 'Babar Azam'
        ];

        const romanUrdu5Star = [
            "Bohat alaw product tha", "Quality bohat zabardast hai", "Bilkul waisa hi hai jaisa dikhaya tha",
            "Highly recommended, maza aa gaya", "Fabric bohat soft hai, very comfortable", "Delivery bht fast thi, shukriya",
            "Packaging bohat achi thi, premium feel aya", "Gift k liye liya tha, sab ko pasand aya", "Value for money hai amazing",
            "Sands Collections never disappoints, love it!", "Behtareen chiz hai, zaroor try karein", "Next time phir order karunga InshaAllah",
            "Color same waisa hi hai pic jaisa", "Size perfect aya hai", "Customer service bohat cooperative hai",
            "Maza aa gaya quality dekh k", "Bohat pyara suit hai", "Khushboo bohat achi hai (fragrance)",
            "Shawl ki quality outclass hai", "10/10 quality", "Dil khush ho gaya parcel khol k", "Original premium quality hai",
            "Bht acha experience raha apke sath", "JazakAllah, bohat achi cheez bheji hai", "Sub se best online store hai Pakistan ka",
            "Finishing bohat neat hai", "Kapra kharab nahi hua wash k baad bhi", "Achi cheez hai, paise pure ho gaye"
        ];

        const romanUrdu4Star = [
            "Cheez achi hai bas delivery late thi", "Product acha hai lekin color thora light hai", "Quality achi hai price k hisab se",
            "Acha hai magar packaging behtar ho sakti thi", "Overall good experience but size issue tha thora", "Recommended hai, bas thora mehnga hai",
            "Fabric acha hai, design bhi pyara hai", "Liked it, will order again", "Sahi hai, bura nahi hai", "Good product, bas packing improve karein"
        ];

        const romanUrdu3Star = [
            "Thik hai bas", "Itna khaas nahi laga mujhe", "Delivery bohat late thi", "Pic me color different lag raha tha",
            "Quality okay hai, extra ordinary nahi", "Average product hai", "Price thori zyada hai quality k hisab se",
            "Guzara hai", "Not bad but expected better", "Thik hai kaam chal jaye ga"
        ];

        const generateReview = (rating: number): Omit<Review, 'id'> => {
            const product = products[Math.floor(Math.random() * products.length)];
            const name = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];

            let commentsPool = romanUrdu5Star;
            if (rating === 4) commentsPool = romanUrdu4Star;
            if (rating === 3) commentsPool = romanUrdu3Star;

            const comment = commentsPool[Math.floor(Math.random() * commentsPool.length)];

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

        // Create reviews array
        for (let i = 0; i < distribution[5]; i++) reviewsToCreate.push(generateReview(5));
        for (let i = 0; i < distribution[4]; i++) reviewsToCreate.push(generateReview(4));
        for (let i = 0; i < distribution[3]; i++) reviewsToCreate.push(generateReview(3));

        // Start Batch Writes (Batch size limit is 500, we have 124, so one batch is fine? No, Firestore batch is 500 ops)
        // We will do chunks of 100 just to be safe and clean
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
