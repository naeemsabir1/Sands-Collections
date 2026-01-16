'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, MapPin, User, Phone, FileText, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, generateWhatsAppMessage, validatePakistaniPhone, formatPhoneForWhatsApp } from '@/lib/utils';

const WHATSAPP_NUMBER = '923066166152';
const SHIPPING_COST = 250;
const FREE_SHIPPING_THRESHOLD = 5000;

interface FormData {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
}

interface FormErrors {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
}

export default function CheckoutPage() {
    const { state, clearCart } = useCart();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const shippingCost = state.totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = state.totalPrice + shippingCost;

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePakistaniPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid Pakistani phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Delivery address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (state.items.length === 0) return;

        setIsSubmitting(true);

        // Prepare order items for WhatsApp message
        const orderItems = state.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.salePrice || item.product.price,
            size: item.selectedSize,
            color: item.selectedColor,
        }));

        // Generate WhatsApp message
        const message = generateWhatsAppMessage(
            orderItems,
            formData,
            state.totalPrice,
            shippingCost
        );

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart after order
        setTimeout(() => {
            clearCart();
            setIsSubmitting(false);
        }, 1000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto px-4"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h1 className="font-playfair text-3xl font-bold text-charcoal mb-4">
                        Cart is Empty
                    </h1>
                    <p className="text-medium-gray mb-8">
                        Your cart is empty. Add some products before checking out.
                    </p>
                    <Link href="/" className="btn-gold inline-flex">
                        Continue Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white py-12">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Back to Cart */}
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-medium-gray hover:text-charcoal mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Checkout Form */}
                    <div>
                        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-8">
                            Checkout
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="flex items-center gap-2 font-semibold text-lg text-charcoal mb-6">
                                    <User size={20} className="text-gold-primary" /> Customer Information
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`input ${errors.name ? 'border-red-500' : ''}`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                                            Phone Number * (WhatsApp preferred)
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`input ${errors.phone ? 'border-red-500' : ''}`}
                                            placeholder="03XX XXXXXXX"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="flex items-center gap-2 font-semibold text-lg text-charcoal mb-6">
                                    <MapPin size={20} className="text-gold-primary" /> Delivery Address
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-charcoal mb-2">
                                            Full Address *
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={`input resize-none ${errors.address ? 'border-red-500' : ''}`}
                                            placeholder="House/Flat No., Street, Area, Landmark"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-charcoal mb-2">
                                            City *
                                        </label>
                                        <select
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`select ${errors.city ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select your city</option>
                                            <option value="Lahore">Lahore</option>
                                            <option value="Karachi">Karachi</option>
                                            <option value="Islamabad">Islamabad</option>
                                            <option value="Rawalpindi">Rawalpindi</option>
                                            <option value="Faisalabad">Faisalabad</option>
                                            <option value="Multan">Multan</option>
                                            <option value="Peshawar">Peshawar</option>
                                            <option value="Quetta">Quetta</option>
                                            <option value="Sialkot">Sialkot</option>
                                            <option value="Gujranwala">Gujranwala</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="flex items-center gap-2 font-semibold text-lg text-charcoal mb-6">
                                    <FileText size={20} className="text-gold-primary" /> Order Notes (Optional)
                                </h2>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="input resize-none"
                                    placeholder="Special instructions, preferred delivery time, etc."
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="font-semibold text-lg text-charcoal mb-4">Payment Method</h2>
                                <div className="flex items-center gap-4 p-4 border-2 border-gold-primary rounded-lg bg-gold-primary/5">
                                    <div className="w-12 h-12 rounded-full bg-gold-primary/20 flex items-center justify-center">
                                        <span className="text-2xl">💵</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-charcoal">Cash on Delivery (COD)</p>
                                        <p className="text-sm text-medium-gray">Pay when you receive your order</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Check size={24} className="text-gold-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-green-600 transition-colors disabled:opacity-70"
                            >
                                <MessageCircle size={22} />
                                {isSubmitting ? 'Processing...' : 'Complete Order via WhatsApp'}
                            </motion.button>

                            <p className="text-center text-sm text-medium-gray">
                                Clicking above will open WhatsApp with your order details
                            </p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="bg-white rounded-xl p-6">
                            <h2 className="font-playfair text-xl font-semibold text-charcoal mb-6">
                                Order Summary
                            </h2>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                                {state.items.map((item) => (
                                    <div
                                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                                        className="flex gap-4"
                                    >
                                        <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={item.product.images[0] || '/placeholder.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-charcoal text-sm line-clamp-1">
                                                {item.product.name}
                                            </p>
                                            {(item.selectedSize || item.selectedColor) && (
                                                <p className="text-xs text-medium-gray">
                                                    {item.selectedSize && `Size: ${item.selectedSize}`}
                                                    {item.selectedSize && item.selectedColor && ' | '}
                                                    {item.selectedColor && `Color: ${item.selectedColor}`}
                                                </p>
                                            )}
                                            <p className="font-medium text-charcoal mt-1">
                                                {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-medium-gray">Subtotal</span>
                                    <span className="text-charcoal">{formatPrice(state.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-medium-gray">Shipping</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span className="text-charcoal">{formatPrice(shippingCost)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100">
                                    <span className="font-semibold text-charcoal">Total</span>
                                    <span className="font-bold text-xl text-charcoal">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-center text-xs text-medium-gray">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg">🔒</span>
                                        Secure Checkout
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg">📦</span>
                                        Fast Delivery
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg">💵</span>
                                        COD Available
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg">↩️</span>
                                        Easy Returns
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
