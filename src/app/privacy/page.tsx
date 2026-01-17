'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function PrivacyPage() {
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
                            <Shield className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Your Privacy Matters
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Privacy Policy
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            How we collect, use, and protect your information
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
                            At <strong className="text-charcoal">Sands Collections</strong>, we are committed to protecting your privacy
                            and ensuring the security of your personal information. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                        </p>
                    </motion.div>

                    {/* Information We Collect */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Database className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">Information We Collect</h2>
                        </div>
                        <div className="space-y-6 text-medium-gray">
                            <div>
                                <h3 className="font-semibold text-charcoal mb-2">Personal Information</h3>
                                <p className="leading-relaxed">When you place an order, we collect:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>Full name and contact details</li>
                                    <li>Shipping and billing address</li>
                                    <li>Phone number (for delivery coordination)</li>
                                    <li>Email address (for order confirmations)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-charcoal mb-2">Automatically Collected Information</h3>
                                <p className="leading-relaxed">
                                    When you browse our website, we may automatically collect device information,
                                    browser type, IP address, and browsing behavior to improve your shopping experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Your Information */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Eye className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">How We Use Your Information</h2>
                        </div>
                        <ul className="space-y-3 text-medium-gray">
                            {[
                                'Process and fulfill your orders',
                                'Communicate order updates via SMS and WhatsApp',
                                'Respond to your inquiries and provide customer support',
                                'Send promotional offers (only with your consent)',
                                'Improve our website and product offerings',
                                'Prevent fraud and ensure security',
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information Sharing */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold text-charcoal">Information Sharing</h2>
                        </div>
                        <div className="text-medium-gray space-y-4">
                            <p className="leading-relaxed">
                                <strong className="text-charcoal">We do not sell your personal information.</strong> We only
                                share your information with:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                                    <span><strong className="text-charcoal">Courier Partners:</strong> To deliver your orders (TCS, Leopards, etc.)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                                    <span><strong className="text-charcoal">Payment Processors:</strong> When processing bank transfers</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                                    <span><strong className="text-charcoal">Legal Requirements:</strong> When required by Pakistani law</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Data Security */}
                    <div className="bg-charcoal rounded-3xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-8 h-8 text-gold-primary" />
                            <h2 className="font-playfair text-2xl font-bold">Data Security</h2>
                        </div>
                        <p className="text-white/80 leading-relaxed mb-4">
                            We implement appropriate security measures to protect your personal information.
                            Our website uses SSL encryption to secure data transmission. However, no method
                            of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                        <p className="text-white/80 leading-relaxed">
                            Your data is stored securely and access is limited to authorized personnel only.
                        </p>
                    </div>

                    {/* Your Rights */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6">Your Rights</h2>
                        <div className="text-medium-gray space-y-3">
                            <p>You have the right to:</p>
                            <ul className="space-y-2 ml-4">
                                <li>• Access the personal information we hold about you</li>
                                <li>• Request correction of inaccurate information</li>
                                <li>• Request deletion of your data (subject to legal requirements)</li>
                                <li>• Opt-out of marketing communications at any time</li>
                                <li>• Lodge a complaint with relevant authorities</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gold-primary/10 rounded-3xl p-8 border border-gold-primary/20">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">Questions About Privacy?</h2>
                        <p className="text-medium-gray mb-6">
                            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
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
