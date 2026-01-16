import { clsx, type ClassValue } from 'clsx';

// Combine class names utility (simplified version without clsx)
export function cn(...inputs: ClassValue[]): string {
    return inputs.filter(Boolean).join(' ');
}

// Convert Google Drive sharing link to direct image URL
export function convertDriveLink(url: string): string {
    if (!url) return '';

    // Check if it's a Google Drive link
    if (url.includes('drive.google.com')) {
        // Extract file ID from various Google Drive URL formats
        let fileId = '';

        // Format: https://drive.google.com/file/d/FILE_ID/view
        const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch) {
            fileId = fileMatch[1];
        }

        // Format: https://drive.google.com/open?id=FILE_ID
        const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (!fileId && openMatch) {
            fileId = openMatch[1];
        }

        // Format: https://drive.google.com/uc?export=view&id=FILE_ID
        const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
        if (!fileId && ucMatch) {
            fileId = ucMatch[1];
        }

        if (fileId) {
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }

    // Return original URL if not a Google Drive link or couldn't parse
    return url;
}

// Format price in PKR
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

// Generate WhatsApp order message
export function generateWhatsAppMessage(
    items: { name: string; quantity: number; price: number; size?: string; color?: string }[],
    customer: { name: string; phone: string; address: string; city: string; notes?: string },
    total: number,
    shippingCost: number
): string {
    const orderItems = items
        .map(item => {
            let itemStr = `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
            if (item.size) itemStr += ` (Size: ${item.size})`;
            if (item.color) itemStr += ` (Color: ${item.color})`;
            return itemStr;
        })
        .join('\n');

    const message = `
🛍️ *NEW ORDER - SANDS COLLECTIONS*

*Customer Details:*
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
City: ${customer.city}
${customer.notes ? `Notes: ${customer.notes}` : ''}

*Order Items:*
${orderItems}

*Subtotal:* ${formatPrice(total)}
*Shipping:* ${formatPrice(shippingCost)}
*Total:* ${formatPrice(total + shippingCost)}

*Payment Method:* Cash on Delivery (COD)
  `.trim();

    return encodeURIComponent(message);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Generate slug from string
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, salePrice: number): number {
    if (!salePrice || salePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Validate Pakistani phone number
export function validatePakistaniPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    // Pakistani phone numbers: 03XXXXXXXXX (11 digits) or +923XXXXXXXXX (12 digits)
    return /^(0?3[0-9]{9}|923[0-9]{9})$/.test(cleaned);
}

// Format phone number for WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    // Convert to international format if needed
    if (cleaned.startsWith('0')) {
        return '92' + cleaned.slice(1);
    }
    return cleaned;
}
