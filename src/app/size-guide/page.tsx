'use client';

import { motion } from 'framer-motion';
import { Ruler, Info, Phone } from 'lucide-react';

const mensSizes = [
    { size: 'S', chest: '38"', shoulder: '17"', length: '28"' },
    { size: 'M', chest: '40"', shoulder: '18"', length: '29"' },
    { size: 'L', chest: '42"', shoulder: '19"', length: '30"' },
    { size: 'XL', chest: '44"', shoulder: '20"', length: '31"' },
    { size: 'XXL', chest: '46"', shoulder: '21"', length: '32"' },
];

const womensSizes = [
    { size: 'XS', bust: '32"', waist: '26"', hips: '35"' },
    { size: 'S', bust: '34"', waist: '28"', hips: '37"' },
    { size: 'M', bust: '36"', waist: '30"', hips: '39"' },
    { size: 'L', bust: '38"', waist: '32"', hips: '41"' },
    { size: 'XL', bust: '40"', waist: '34"', hips: '43"' },
];

const unstitchedLengths = [
    { piece: 'Shirt', length: '2.5 - 3 meters' },
    { piece: 'Dupatta', length: '2.5 meters' },
    { piece: 'Trouser/Shalwar', length: '2.5 meters' },
    { piece: 'Full Suit (3 Piece)', length: '7.5 - 8 meters' },
];

const shawlSizes = [
    { type: 'Standard Shawl', dimensions: '2.5 x 1 meter' },
    { type: 'Large Shawl', dimensions: '2.75 x 1.25 meters' },
    { type: 'Pashmina Shawl', dimensions: '2 x 1 meter' },
    { type: 'Dupatta', dimensions: '2.5 x 1.25 meters' },
];

export default function SizeGuidePage() {
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
                            <Ruler className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Find Your Perfect Fit
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Size Guide
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            Reference charts to help you choose the right size
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* How to Measure */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-gold-primary to-amber-500 p-8 rounded-3xl text-white"
                    >
                        <div className="flex items-start gap-4">
                            <Info className="w-8 h-8 flex-shrink-0" />
                            <div>
                                <h2 className="font-playfair text-xl font-bold mb-3">How to Measure</h2>
                                <p className="text-white/90">
                                    For the most accurate fit, use a soft measuring tape and measure over light clothing.
                                    Keep the tape snug but not tight. If you're between sizes, we recommend choosing the larger size
                                    for comfort, especially for Eastern wear.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Men's Size Chart */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6">Men's Kurta / Kameez Sizes</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Size</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Chest</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Shoulder</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mensSizes.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-gold-primary">{row.size}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.chest}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.shoulder}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Women's Size Chart */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6">Women's Ready-to-Wear Sizes</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Size</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Bust</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Waist</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal">Hips</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {womensSizes.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-gold-primary">{row.size}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.bust}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.waist}</td>
                                            <td className="py-4 px-6 text-charcoal">{row.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Unstitched Fabric & Shawls - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="font-playfair text-xl font-bold text-charcoal mb-6">Unstitched Fabric Lengths</h2>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-sm font-semibold text-charcoal">Piece</th>
                                        <th className="text-left py-3 text-sm font-semibold text-charcoal">Fabric Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unstitchedLengths.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-50">
                                            <td className="py-3 text-charcoal">{row.piece}</td>
                                            <td className="py-3 text-gold-primary font-medium">{row.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="font-playfair text-xl font-bold text-charcoal mb-6">Shawl & Dupatta Sizes</h2>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-sm font-semibold text-charcoal">Type</th>
                                        <th className="text-left py-3 text-sm font-semibold text-charcoal">Dimensions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shawlSizes.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-50">
                                            <td className="py-3 text-charcoal">{row.type}</td>
                                            <td className="py-3 text-gold-primary font-medium">{row.dimensions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Ihram Sizes */}
                    <div className="bg-charcoal rounded-3xl p-8 text-white">
                        <h2 className="font-playfair text-2xl font-bold mb-6">Ihram Collection Sizes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-gold-primary mb-3">Men's Ihram</h3>
                                <ul className="space-y-2 text-white/80">
                                    <li>• Rida (Upper Cloth): 2.25 x 1.1 meters</li>
                                    <li>• Izaar (Lower Cloth): 1.8 x 1.1 meters</li>
                                    <li>• One size fits most (adjustable)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gold-primary mb-3">Women's Prayer Set</h3>
                                <ul className="space-y-2 text-white/80">
                                    <li>• Available in Free Size</li>
                                    <li>• Fits bust sizes 32" to 44"</li>
                                    <li>• Adjustable with elastic waistband</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="text-center">
                        <p className="text-medium-gray mb-4">Still unsure about your size?</p>
                        <a
                            href="https://wa.me/923334944293"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-primary text-white font-medium rounded-full hover:bg-gold-dark transition-all"
                        >
                            <Phone size={18} />
                            Chat with us for personalized sizing help
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
