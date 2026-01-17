'use client';

import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, CreditCard, Phone, CheckCircle } from 'lucide-react';

const shippingZones = [
    { city: 'Lahore, Karachi, Islamabad', time: '2-3 Business Days', cost: 'Free (Above PKR 5,000)' },
    { city: 'Faisalabad, Multan, Peshawar', time: '3-4 Business Days', cost: 'PKR 250' },
    { city: 'Other Major Cities', time: '4-5 Business Days', cost: 'PKR 300' },
    { city: 'Remote Areas', time: '5-7 Business Days', cost: 'PKR 400' },
];

export default function ShippingPage() {
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
                            <Truck className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Delivery Information
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Shipping Policy
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            Fast & reliable delivery across Pakistan
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Free Shipping Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-gold-primary to-amber-500 p-8 rounded-3xl text-white text-center"
                    >
                        <Package className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="font-playfair text-2xl font-bold mb-2">Free Shipping on Orders Above PKR 5,000</h2>
                        <p className="text-white/80">Enjoy complimentary delivery on all orders across major cities</p>
                    </motion.div>

                    {/* Shipping Zones Table */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-gold-primary" />
                            Delivery Zones & Timelines
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-charcoal">Destination</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-charcoal">Delivery Time</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-charcoal">Shipping Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shippingZones.map((zone, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-charcoal">{zone.city}</td>
                                            <td className="py-4 px-4 text-medium-gray">{zone.time}</td>
                                            <td className="py-4 px-4 text-gold-primary font-medium">{zone.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Key Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <Clock className="w-10 h-10 text-gold-primary mb-4" />
                            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Order Processing</h3>
                            <p className="text-medium-gray leading-relaxed">
                                Orders placed before 2:00 PM are processed the same day. Orders placed after 2:00 PM or on weekends will be processed the next business day.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <CreditCard className="w-10 h-10 text-gold-primary mb-4" />
                            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Cash on Delivery</h3>
                            <p className="text-medium-gray leading-relaxed">
                                We offer Cash on Delivery (COD) across Pakistan. Payment is collected at the time of delivery. Please have the exact amount ready for a smooth transaction.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <Package className="w-10 h-10 text-gold-primary mb-4" />
                            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Premium Packaging</h3>
                            <p className="text-medium-gray leading-relaxed">
                                Every order is carefully wrapped in our signature premium packaging. Your items arrive protected and presented beautifully – perfect for gifting or personal indulgence.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <Phone className="w-10 h-10 text-gold-primary mb-4" />
                            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Delivery Updates</h3>
                            <p className="text-medium-gray leading-relaxed">
                                You will receive SMS and WhatsApp updates at every stage – from order confirmation to dispatch and delivery. Our team will call before delivery to confirm your availability.
                            </p>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-charcoal rounded-3xl p-8 text-white">
                        <h3 className="font-playfair text-xl font-bold mb-6">Important Information</h3>
                        <ul className="space-y-4">
                            {[
                                'Delivery timelines may vary during Eid, Ramadan, and other peak seasons',
                                'For fragrance orders, additional care is taken during summer months',
                                'Remote areas may experience slight delays due to courier limitations',
                                'Signature or CNIC verification may be required at delivery',
                                'Contact us immediately if you have not received your order within the expected timeframe',
                            ].map((note, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-white/80">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center">
                        <p className="text-medium-gray mb-4">Have questions about shipping?</p>
                        <a
                            href="https://wa.me/923334944293"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-primary text-white font-medium rounded-full hover:bg-gold-dark transition-all"
                        >
                            <Phone size={18} />
                            Chat with us on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
