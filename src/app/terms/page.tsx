'use client';

import { motion } from 'framer-motion';
import { FileText, ShoppingCart, CreditCard, Package, AlertTriangle, Scale, Phone, Mail, Calendar } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Section */}
            <section className="bg-white pt-10 pb-16 border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-gold-primary/30 bg-gold-primary/10"
                        >
                            <FileText className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Legal Agreement
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Terms & Conditions
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            Please read these terms carefully before using our services
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-medium-gray mt-4 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Last Updated: January 2026
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                    >
                        <p className="text-medium-gray leading-relaxed">
                            Welcome to <strong className="text-charcoal">Sands Collections</strong>. By accessing our website
                            and placing orders, you agree to be bound by these Terms and Conditions. If you do not agree
                            with any part of these terms, please do not use our services.
                        </p>
                    </motion.div>

                    {/* General Terms */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">General Terms</h2>
                        </div>
                        <ul className="space-y-4 text-medium-gray">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">1.</span>
                                <span>Sands Collections operates as an online retail store based in Lahore, Pakistan, specializing in premium Pakistani fashion, fragrances, and lifestyle products.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">2.</span>
                                <span>By using our website, you confirm that you are at least 18 years of age or are accessing the site under the supervision of a parent or guardian.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">3.</span>
                                <span>All content on this website, including images, text, and designs, is the property of Sands Collections and is protected by copyright laws.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">4.</span>
                                <span>We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of updated terms.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Orders & Purchases */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <ShoppingCart className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">Orders & Purchases</h2>
                        </div>
                        <ul className="space-y-4 text-medium-gray">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>All orders are subject to availability. We reserve the right to refuse or cancel any order for any reason.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Product images are for illustration purposes. Actual colors may vary slightly due to screen settings and photography.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Prices are listed in Pakistani Rupees (PKR) and are subject to change without prior notice.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>An order is only confirmed once you receive a confirmation message via SMS or WhatsApp.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>We reserve the right to limit quantities or discontinue products at any time.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Payment Terms */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">Payment Terms</h2>
                        </div>
                        <ul className="space-y-4 text-medium-gray">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>We accept Cash on Delivery (COD) across Pakistan. Payment is due at the time of delivery.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Bank transfers are accepted for advance payments. Full payment must be received before order dispatch.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Refusal to pay upon delivery may result in blacklisting from future orders and legal action for recovery of costs.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Providing false or inaccurate information during checkout may lead to order cancellation.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Shipping & Delivery */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">Shipping & Delivery</h2>
                        </div>
                        <ul className="space-y-4 text-medium-gray">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Delivery timelines are estimates and may vary due to unforeseen circumstances, weather, or peak season delays.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Risk of loss or damage transfers to the customer upon delivery to the shipping address provided.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Please inspect packages upon delivery. Report any damage or discrepancy within 24 hours.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>We are not responsible for delays caused by incorrect addresses provided by the customer.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Limitation of Liability */}
                    <div className="bg-charcoal rounded-3xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold">Limitation of Liability</h2>
                        </div>
                        <ul className="space-y-4 text-white/80">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Sands Collections shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>Our liability is limited to the purchase price of the product in question.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold-primary font-bold">•</span>
                                <span>We do not guarantee uninterrupted access to our website and are not liable for any technical issues.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Governing Law */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">Governing Law</h2>
                        <p className="text-medium-gray leading-relaxed">
                            These Terms and Conditions are governed by and construed in accordance with the laws of
                            the Islamic Republic of Pakistan. Any disputes shall be subject to the exclusive jurisdiction
                            of the courts located in Lahore, Pakistan.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-gold-primary/10 rounded-3xl p-8 border border-gold-primary/20">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">Questions About Our Terms?</h2>
                        <p className="text-medium-gray mb-6">
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://wa.me/923334944293"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white font-medium rounded-full hover:bg-gold-primary transition-all"
                            >
                                <Phone size={18} />
                                WhatsApp
                            </a>
                            <a
                                href="mailto:sandsclothingofficial@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-charcoal font-medium rounded-full border border-gray-200 hover:border-gold-primary transition-all"
                            >
                                <Mail size={18} />
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
