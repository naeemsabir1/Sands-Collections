'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addContactMessage } from '@/lib/firestore';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const result = await addContactMessage({
                name: formState.name,
                email: formState.email,
                subject: formState.subject,
                message: formState.message,
            });

            if (result) {
                setIsSubmitted(true);
                setFormState({ name: '', email: '', subject: '', message: '' });
                // Reset success state after 5 seconds
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                setError('Failed to send message. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <section className="bg-white pt-32 pb-16 border-b border-gray-100 relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-medium-gray text-lg max-w-2xl mx-auto"
                        >
                            We'd love to hear from you. Whether you have a question about our collections, need assistance with an order, or just want to say hello.
                        </motion.p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Info Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full">
                            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-8">Contact Information</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center flex-shrink-0 text-gold-primary">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-medium-gray font-medium mb-1">Email Us</p>
                                        <a href="mailto:sandsclothingofficial@gmail.com" className="text-charcoal font-semibold hover:text-gold-primary transition-colors">
                                            sandsclothingofficial@gmail.com
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">Response within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center flex-shrink-0 text-gold-primary">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-medium-gray font-medium mb-1">Call Us</p>
                                        <a href="tel:+923334944293" className="text-charcoal font-semibold hover:text-gold-primary transition-colors">
                                            +92 333 4944293
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">Mon-Sat, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center flex-shrink-0 text-gold-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-medium-gray font-medium mb-1">Visit Us</p>
                                        <p className="text-charcoal font-semibold">
                                            Sands Collections HQ
                                        </p>
                                        <p className="text-sm text-medium-gray mt-1">Lahore, Pakistan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <p className="text-sm text-medium-gray font-medium mb-4">Follow Us</p>
                                <div className="flex gap-4">
                                    <a href="https://www.instagram.com/sands_collections_official" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal hover:bg-gold-primary hover:text-white transition-all duration-300">
                                        <Instagram size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">Send us a Message</h3>
                            <p className="text-medium-gray mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-charcoal">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all placeholder:text-gray-400"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-charcoal">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all placeholder:text-gray-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-charcoal">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formState.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all placeholder:text-gray-400"
                                        placeholder="Order Inquiry"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-charcoal">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Success Message */}
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-green-700 font-medium">Message Sent Successfully!</p>
                                            <p className="text-green-600 text-sm">We'll get back to you within 24 hours. Shukriya!</p>
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-3 bg-charcoal text-white font-medium rounded-xl hover:bg-gold-primary transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Map Section would go here */}
        </div>
    );
}
