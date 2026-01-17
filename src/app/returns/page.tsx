'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, Package, Phone, AlertCircle } from 'lucide-react';

const returnableItems = [
    'Unstitched fabric (if unopened and in original packaging)',
    'Ready-to-wear clothing (unworn, with tags attached)',
    'Shawls and dupattas (unused, in original condition)',
    'Ihram sets (sealed, unopened)',
];

const nonReturnableItems = [
    'Fragrances and perfumes (due to hygiene reasons)',
    'Customized or altered items',
    'Items marked as "Final Sale" or "Non-Returnable"',
    'Products purchased during clearance sales',
    'Intimate wear or undergarments',
];

export default function ReturnsPage() {
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
                            <RotateCcw className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Hassle-Free Returns
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Returns & Exchange Policy
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            Your satisfaction is our priority
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* 7-Day Return Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-charcoal to-gray-800 p-8 rounded-3xl text-white text-center"
                    >
                        <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="font-playfair text-3xl font-bold text-gold-primary">7</span>
                        </div>
                        <h2 className="font-playfair text-2xl font-bold mb-2">7-Day Easy Returns</h2>
                        <p className="text-white/80">Return or exchange within 7 days of delivery – no questions asked</p>
                    </motion.div>

                    {/* Return Process Steps */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-8 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-gold-primary" />
                            How to Return or Exchange
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { step: '1', title: 'Contact Us', desc: 'WhatsApp us at 0333-4944293 within 7 days of receiving your order' },
                                { step: '2', title: 'Share Details', desc: 'Provide your order number, reason for return, and photos of the item' },
                                { step: '3', title: 'Pack Securely', desc: 'Pack the item in original packaging with all tags attached' },
                                { step: '4', title: 'Ship or Pickup', desc: 'We arrange pickup from your doorstep or you can courier it back' },
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-gold-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                        {item.step}
                                    </div>
                                    <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                                    <p className="text-sm text-medium-gray">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Returnable vs Non-Returnable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                                <h3 className="font-playfair text-xl font-bold text-charcoal">Eligible for Return</h3>
                            </div>
                            <ul className="space-y-3">
                                {returnableItems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-medium-gray">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="w-8 h-8 text-red-500" />
                                <h3 className="font-playfair text-xl font-bold text-charcoal">Not Eligible</h3>
                            </div>
                            <ul className="space-y-3">
                                {nonReturnableItems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-medium-gray">
                                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
                            <Package className="w-6 h-6 text-gold-primary" />
                            Refund Information
                        </h2>
                        <div className="space-y-4 text-medium-gray">
                            <p>
                                <strong className="text-charcoal">Exchange:</strong> We highly recommend opting for an exchange. You can choose any product of equal or higher value (pay the difference for higher value items).
                            </p>
                            <p>
                                <strong className="text-charcoal">Store Credit:</strong> If your preferred item is out of stock, we will issue store credit valid for 6 months.
                            </p>
                            <p>
                                <strong className="text-charcoal">Refund:</strong> For COD orders, refunds are processed within 7-10 business days via bank transfer or EasyPaisa/JazzCash. Original shipping charges are non-refundable.
                            </p>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Please Note</h3>
                                <ul className="space-y-2 text-medium-gray">
                                    <li>• Items must be unworn, unwashed, and in original condition with all tags attached</li>
                                    <li>• Returns initiated after 7 days will not be accepted</li>
                                    <li>• For defective items, we offer free pickup and full refund/replacement</li>
                                    <li>• Color variations due to screen settings are not considered defects</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center">
                        <p className="text-medium-gray mb-4">Need help with a return?</p>
                        <a
                            href="https://wa.me/923334944293"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-primary text-white font-medium rounded-full hover:bg-gold-dark transition-all"
                        >
                            <Phone size={18} />
                            Contact Us on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
