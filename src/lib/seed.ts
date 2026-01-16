// Database Seed Script for Sands Collections
// Clears existing data and populates fresh products

import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// PRODUCT DATA - Premium Pakistani Fashion
// ============================================

const products = [
    // ========== MEN'S SHAWLS (4 Products) ==========
    {
        name: 'Pure Pashmina Shawl - Charcoal',
        description: 'Exquisite pure pashmina shawl in deep charcoal grey. Hand-woven with traditional Kashmiri techniques. Incredibly soft, warm, and luxuriously lightweight.',
        price: 18500,
        salePrice: 15999,
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070'],
        category: 'mens-shawls',
        material: 'Pure Pashmina',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Woolen Gents Shawl - Navy',
        description: 'Premium Australian merino wool shawl in sophisticated navy blue. Perfect for winter evenings and formal gatherings.',
        price: 8500,
        images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=2070'],
        category: 'mens-shawls',
        material: 'Merino Wool',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Kashmiri Embroidered Shawl',
        description: 'Luxurious hand-embroidered Kashmiri shawl with intricate paisley patterns. A masterpiece of traditional craftsmanship.',
        price: 35000,
        salePrice: 29000,
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070'],
        category: 'mens-shawls',
        material: 'Pashmina Blend',
        inStock: true,
        badge: 'limited-stock',
    },
    {
        name: 'Classic Woolen Shawl - Black',
        description: 'Timeless black woolen shawl for the modern gentleman. Versatile enough for casual and formal occasions.',
        price: 6500,
        images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=2070'],
        category: 'mens-shawls',
        material: 'Australian Wool',
        inStock: true,
    },

    // ========== MEN'S UNSTITCHED SUITING (4 Products) ==========
    {
        name: 'Premium Wool Suiting - Charcoal Grey',
        description: 'Fine Italian-style wool suiting fabric in sophisticated charcoal grey. Perfect drape and durability for formal suits.',
        price: 12500,
        salePrice: 10999,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080'],
        category: 'mens-unstitched-suiting',
        material: 'Italian Wool',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Tropical Suiting - Navy Blue',
        description: 'Breathable tropical weight suiting for year-round comfort. Classic navy blue with subtle texture.',
        price: 8500,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070'],
        category: 'mens-unstitched-suiting',
        material: 'Tropical Blend',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Prince of Wales Check Suiting',
        description: 'Distinguished Prince of Wales check pattern in classic grey. Timeless British elegance for the discerning gentleman.',
        price: 14000,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080'],
        category: 'mens-unstitched-suiting',
        material: 'Wool Blend',
        inStock: true,
    },
    {
        name: 'Summer Linen Suiting - Beige',
        description: 'Lightweight pure linen suiting fabric. Ideal for summer weddings and outdoor events.',
        price: 9500,
        salePrice: 7999,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070'],
        category: 'mens-unstitched-suiting',
        material: 'Pure Linen',
        inStock: true,
        badge: 'sale',
    },

    // ========== WOMEN'S SHAWLS (4 Products) ==========
    {
        name: 'Pashmina Shawl - Rose Pink',
        description: 'Delicate rose pink pashmina shawl with hand-rolled edges. Ultra-soft and perfect for elegant occasions.',
        price: 16500,
        salePrice: 13999,
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574'],
        category: 'womens-shawls',
        material: 'Pure Pashmina',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Embroidered Velvet Shawl',
        description: 'Luxurious velvet shawl with intricate gold thread embroidery. Statement piece for formal events.',
        price: 28000,
        images: ['https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787'],
        category: 'womens-shawls',
        material: 'Velvet',
        inStock: true,
        badge: 'limited-stock',
    },
    {
        name: 'Cashmere Wrap - Ivory',
        description: 'Pure cashmere wrap in elegant ivory. Lightweight warmth that drapes beautifully.',
        price: 22000,
        salePrice: 18500,
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574'],
        category: 'womens-shawls',
        material: 'Pure Cashmere',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Printed Woolen Shawl',
        description: 'Vibrant printed woolen shawl with traditional motifs. Warm and stylish for winter styling.',
        price: 7500,
        images: ['https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787'],
        category: 'womens-shawls',
        material: 'Merino Wool',
        inStock: true,
    },

    // ========== WOMEN'S DUPPATTAS (4 Products) ==========
    {
        name: 'Organza Duppatta - Coral',
        description: 'Stunning organza duppatta with delicate embroidery borders. Adds grace to any outfit.',
        price: 4500,
        salePrice: 3699,
        images: ['https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787'],
        category: 'womens-duppattas',
        material: 'Organza',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Chiffon Duppatta - Gold',
        description: 'Luxurious gold chiffon duppatta with gota work. Perfect for weddings and festive occasions.',
        price: 6500,
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574'],
        category: 'womens-duppattas',
        material: 'Pure Chiffon',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Net Duppatta - Peach',
        description: 'Elegant net duppatta with sequin borders. Lightweight and beautifully feminine.',
        price: 3500,
        images: ['https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=2787'],
        category: 'womens-duppattas',
        material: 'Net',
        inStock: true,
    },
    {
        name: 'Banarasi Silk Duppatta',
        description: 'Traditional Banarasi silk duppatta with zari work. Heirloom quality craftsmanship.',
        price: 12000,
        salePrice: 9999,
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574'],
        category: 'womens-duppattas',
        material: 'Banarasi Silk',
        inStock: true,
        badge: 'limited-stock',
    },

    // ========== FRAGRANCES - MENS (3 Products) ==========
    {
        name: 'Arabian Oud Intense',
        description: 'Deep and mysterious Arabian oud with smoky undertones. Long-lasting fragrance that commands attention. Notes: Oud, Amber, Sandalwood.',
        price: 8500,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-mens',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Blue Ocean EDT',
        description: 'Fresh aquatic fragrance with citrus top notes. Perfect for daily wear. Notes: Bergamot, Sea Salt, Musk.',
        price: 5500,
        salePrice: 4499,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-mens',
        inStock: true,
        badge: 'sale',
    },
    {
        name: 'Midnight Leather',
        description: 'Bold leather fragrance with spicy undertones. Sophisticated evening scent. Notes: Leather, Pepper, Vetiver.',
        price: 7500,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-mens',
        inStock: true,
        badge: 'new-arrival',
    },

    // ========== FRAGRANCES - WOMENS (3 Products) ==========
    {
        name: 'Rose Musk Perfume',
        description: 'Delicate rose petals blended with soft white musk. Feminine and romantic. Notes: Rose, Musk, Vanilla.',
        price: 5500,
        salePrice: 4499,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-womens',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Jasmine Dreams',
        description: 'Intoxicating jasmine fragrance with floral heart. Romantic and elegant. Notes: Jasmine, Ylang-Ylang, Amber.',
        price: 6500,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-womens',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Velvet Orchid',
        description: 'Luxurious orchid fragrance with creamy notes. Seductive and mysterious. Notes: Orchid, Vanilla, Sandalwood.',
        price: 7500,
        salePrice: 5999,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-womens',
        inStock: true,
        badge: 'sale',
    },

    // ========== FRAGRANCES - UNISEX (3 Products) ==========
    {
        name: 'Amber & Sandalwood',
        description: 'Warm amber notes with creamy sandalwood base. Sophisticated unisex fragrance. Notes: Amber, Sandalwood, Cedar.',
        price: 6500,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-unisex',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'White Musk',
        description: 'Clean and fresh white musk. Subtle yet captivating. Notes: White Musk, Bergamot, Cedarwood.',
        price: 4500,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-unisex',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Oud Royale',
        description: 'Premium oud blend for discerning tastes. Rich and complex. Notes: Oud, Rose, Saffron.',
        price: 12000,
        salePrice: 9999,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104'],
        category: 'fragrances-unisex',
        inStock: true,
        badge: 'limited-stock',
    },

    // ========== IHRAM - LADIES (3 Products) ==========
    {
        name: 'Premium Ladies Ihram Set',
        description: 'Complete white Ihram set for ladies. Soft cotton blend with loose fit for maximum comfort during Hajj and Umrah.',
        price: 3500,
        salePrice: 2999,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-ladies',
        material: 'Cotton Blend',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Luxury Ladies Prayer Set',
        description: 'High-quality prayer garment set in pure white. Breathable fabric for extended wear.',
        price: 4500,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-ladies',
        material: 'Premium Cotton',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Standard Ladies Ihram',
        description: 'Comfortable and affordable ladies Ihram. Lightweight and easy to wear.',
        price: 2200,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-ladies',
        material: 'Cotton',
        inStock: true,
    },

    // ========== IHRAM - GENTS (3 Products) ==========
    {
        name: 'Premium Cotton Ihram Set',
        description: 'Pure white cotton Ihram set for Hajj and Umrah. Soft, breathable, and comfortable for long wear. Includes two pieces.',
        price: 2500,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-gents',
        material: 'Cotton',
        inStock: true,
        badge: 'best-seller',
    },
    {
        name: 'Luxury Terry Ihram',
        description: 'Heavy-weight terry cotton Ihram with excellent absorbency. Premium quality for maximum comfort.',
        price: 3500,
        salePrice: 2999,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-gents',
        material: 'Terry Cotton',
        inStock: true,
        badge: 'new-arrival',
    },
    {
        name: 'Standard Gents Ihram Set',
        description: 'Classic white Ihram set. Lightweight and durable for your spiritual journey.',
        price: 1800,
        images: ['https://plus.unsplash.com/premium_photo-1678122822557-55e1432f4b46?q=80&w=2574'],
        category: 'ihram-gents',
        material: 'Polyester Blend',
        inStock: true,
    },
];

// Hero Slides Data
const heroSlides = [
    {
        title: "Winter '26",
        subtitle: 'Shawl Collection',
        description: 'Discover our exclusive range of premium shawls',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070',
        ctaText: 'Shop Shawls',
        ctaLink: '/men/shawls',
        order: 0,
    },
    {
        title: "Women's Collection",
        subtitle: 'Elegance Defined',
        description: 'Timeless pieces for the modern woman',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2574',
        ctaText: 'Shop Women',
        ctaLink: '/women',
        order: 1,
    },
    {
        title: 'Luxury Fragrances',
        subtitle: 'Signature Scents',
        description: 'Find your perfect fragrance from our curated collection',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2104',
        ctaText: 'Explore',
        ctaLink: '/fragrances',
        order: 2,
    },
];

// Curated Categories Data (for horizontal scrolling section)
const curatedCategories = [
    {
        name: "Men's Shawls",
        description: 'Premium Pashmina',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=200&h=200&fit=crop',
        href: '/men/shawls',
        order: 0,
    },
    {
        name: "Men's Suiting",
        description: 'Fine Fabrics',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200&h=200&fit=crop',
        href: '/men/unstitched-suiting',
        order: 1,
    },
    {
        name: "Women's Shawls",
        description: 'Elegant Wraps',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200&h=200&fit=crop',
        href: '/women/shawls',
        order: 2,
    },
    {
        name: "Duppattas",
        description: 'Luxurious Designs',
        image: 'https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?q=80&w=200&h=200&fit=crop',
        href: '/women/duppattas',
        order: 3,
    },
    {
        name: 'Fragrances',
        description: 'Signature Scents',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&h=200&fit=crop',
        href: '/fragrances',
        order: 4,
    },
    {
        name: 'Ihram',
        description: 'Sacred Garments',
        image: 'https://images.unsplash.com/photo-1598018552394-3c72633d4546?q=80&w=200&h=200&fit=crop',
        href: '/ihram',
        order: 5,
    },
];

// Featured Collections Data (for bento grid)
const featuredCollections = [
    {
        title: "Men's Shawls",
        subtitle: 'Premium Pashmina',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800',
        href: '/men/shawls',
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
        title: "Women's Shawls",
        subtitle: 'Elegant Wraps',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
        href: '/women/shawls',
        span: 'large',
        order: 3,
    },
];

// Site Settings
const siteSettings = {
    storeName: 'Sands Collections',
    whatsappNumber: '+923066166152',
    email: 'info@sandscollections.com',
    address: 'DHA Phase 6, Lahore, Pakistan',
    socialLinks: {
        instagram: 'https://instagram.com/sandscollections',
    },
    shippingCost: 250,
    freeShippingThreshold: 5000,
};

// ============================================
// SEED FUNCTIONS
// ============================================

// Clear all documents from a collection
async function clearCollection(collectionName: string) {
    console.log(`🗑️ Clearing ${collectionName}...`);
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(docSnapshot =>
        deleteDoc(doc(db, collectionName, docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log(`   ✓ Deleted ${snapshot.docs.length} documents from ${collectionName}`);
}

// Main seed function
export async function seedDatabase() {
    console.log('🌱 Starting database seed...');
    console.log('================================');

    try {
        // Step 1: Clear existing data
        console.log('\n📦 Step 1: Clearing existing data...');
        await clearCollection('products');
        await clearCollection('heroSlides');
        await clearCollection('curatedCategories');
        await clearCollection('featuredCollections');

        // Step 2: Add products
        console.log('\n📦 Step 2: Adding products...');
        const batch = writeBatch(db);

        for (const product of products) {
            const docRef = doc(collection(db, 'products'));
            batch.set(docRef, {
                ...product,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        }

        // Step 3: Add hero slides
        console.log('🖼️ Step 3: Adding hero slides...');
        for (const slide of heroSlides) {
            const docRef = doc(collection(db, 'heroSlides'));
            batch.set(docRef, slide);
        }

        // Step 4: Add curated categories
        console.log('📂 Step 4: Adding curated categories...');
        for (const category of curatedCategories) {
            const docRef = doc(collection(db, 'curatedCategories'));
            batch.set(docRef, category);
        }

        // Step 5: Add featured collections
        console.log('🎨 Step 5: Adding featured collections...');
        for (const featured of featuredCollections) {
            const docRef = doc(collection(db, 'featuredCollections'));
            batch.set(docRef, featured);
        }

        // Step 6: Add site settings
        console.log('⚙️ Step 6: Setting up site configuration...');
        const settingsRef = doc(db, 'settings', 'main');
        batch.set(settingsRef, siteSettings);

        // Commit all writes
        await batch.commit();

        console.log('\n================================');
        console.log('✅ Database seeded successfully!');
        console.log(`   • ${products.length} products added`);
        console.log(`   • ${heroSlides.length} hero slides added`);
        console.log(`   • ${curatedCategories.length} curated categories added`);
        console.log(`   • ${featuredCollections.length} featured collections added`);
        console.log('   • Site settings configured');
        console.log('================================');

        return true;
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return false;
    }
}

// Export data for reference
export { products, heroSlides, curatedCategories, featuredCollections, siteSettings };
