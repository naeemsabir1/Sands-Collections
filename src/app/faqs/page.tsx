'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Package, Truck, CreditCard, RotateCcw, Phone, ShoppingBag, Shirt, Sparkles } from 'lucide-react';
import { useState } from 'react';

const faqCategories = [
    {
        title: 'Orders & Payment',
        icon: ShoppingBag,
        faqs: [
            {
                question: 'Kya Cash on Delivery available hai?',
                answer: 'Ji bilkul! Hum poore Pakistan mein Cash on Delivery (COD) offer karte hain. Aap apne order ki payment delivery ke waqt kar sakte hain. Exact amount rakhna please taake rider ko change na dena pare.'
            },
            {
                question: 'Order kaise place karein?',
                answer: 'Aap hamari website se directly order place kar sakte hain – product select karein, size choose karein, aur checkout pe apna address dein. Ya phir WhatsApp pe 0333-4944293 pe message karein, hum aapki help karenge.'
            },
            {
                question: 'Kya online payment bhi kar sakte hain?',
                answer: 'Abhi ke liye sirf COD available hai. Bank transfer ke through advance payment bhi accept ki jaati hai – WhatsApp pe contact karein for bank details.'
            },
            {
                question: 'Order confirm hone ke baad cancel ho sakta hai?',
                answer: 'Ji haan, agar order abhi dispatch nahi hua to cancel ho sakta hai. Dispatch hone ke baad cancellation nahi hogi, lekin aap return kar sakte hain delivery ke 7 din ke andar.'
            },
        ]
    },
    {
        title: 'Shipping & Delivery',
        icon: Truck,
        faqs: [
            {
                question: 'Delivery kitne din mein hoti hai?',
                answer: 'Major cities (Lahore, Karachi, Islamabad) mein 2-3 din, baaki cities mein 3-5 din, aur remote areas mein 5-7 din lag sakte hain. Orders 2 PM se pehle place kiye hain to same day dispatch hote hain.'
            },
            {
                question: 'Shipping charges kitne hain?',
                answer: 'PKR 5,000 se upar ke orders pe delivery FREE hai! Iske neeche ke orders pe PKR 250-400 charges hain depending on location.'
            },
            {
                question: 'Kya order track kar sakte hain?',
                answer: 'Ji! Order dispatch hone ke baad aapko SMS aur WhatsApp pe tracking details mil jaati hain. Delivery se pehle rider call bhi karta hai confirmation ke liye.'
            },
            {
                question: 'Eid/Ramadan mein delivery time badh jata hai?',
                answer: 'Haan, peak seasons mein 1-2 din extra lag sakte hain. Early order place karna behtar hai taake time pe pohonch jaye.'
            },
        ]
    },
    {
        title: 'Returns & Exchange',
        icon: RotateCcw,
        faqs: [
            {
                question: 'Return policy kya hai?',
                answer: '7 din ke andar return ya exchange kar sakte hain. Item unworn hona chahiye, original packaging mein, aur saare tags attached hon. Fragrances aur customized items return nahi ho sakte.'
            },
            {
                question: 'Return kaise karein?',
                answer: 'WhatsApp pe contact karein 0333-4944293 pe. Order number aur photos share karein. Hum pickup arrange kar denge ya aap courier kar sakte hain.'
            },
            {
                question: 'Refund kab milta hai?',
                answer: 'Return receive hone ke baad 7-10 business days mein refund process hota hai. Bank transfer ya EasyPaisa/JazzCash ke through amount transfer hoti hai.'
            },
            {
                question: 'Exchange mein nayi item ki delivery charges honge?',
                answer: 'Agar defective item hai to FREE exchange. Customer preference ke liye exchange pe delivery charges applicable hain.'
            },
        ]
    },
    {
        title: 'Products & Sizing',
        icon: Shirt,
        faqs: [
            {
                question: 'Unstitched mein kitna fabric aata hai?',
                answer: 'Standard suit mein: Shirt 2.5-3m, Dupatta 2.5m, Trouser 2.5m. Full 3-piece suit mein approximately 7.5-8 meters fabric hota hai.'
            },
            {
                question: 'Size guide kahan dekhein?',
                answer: 'Har product page pe size details hain. Detailed size chart ke liye hamara Size Guide page visit karein. Agar phir bhi confusion ho to WhatsApp pe measurements share karein.'
            },
            {
                question: 'Fragrances original hain?',
                answer: 'Ji bilkul! Hum sirf 100% authentic fragrances sell karte hain. Har product genuinely sourced hai aur quality guaranteed hai.'
            },
            {
                question: 'Fabric ki quality kaisi hai?',
                answer: 'Sands Collections sirf premium quality fabrics use karta hai. Lawn, cotton, silk – sab carefully selected hain. Quality hamari priority hai, that\'s our promise.'
            },
        ]
    },
    {
        title: 'Account & Support',
        icon: HelpCircle,
        faqs: [
            {
                question: 'Customer support se kaise contact karein?',
                answer: 'WhatsApp: 0333-4944293 (fastest response), Instagram: @sands_collections_official. Monday to Saturday, 10 AM to 8 PM available hain.'
            },
            {
                question: 'Complaint kaise register karein?',
                answer: 'WhatsApp pe order details ke sath complaint share karein. Hum 24 hours mein respond karte hain aur jaldi se jaldi resolve karte hain.'
            },
            {
                question: 'Kya wholesale orders lete hain?',
                answer: 'Ji haan! Bulk orders ke liye WhatsApp pe contact karein. Special pricing available hai wholesale customers ke liye.'
            },
            {
                question: 'New collections ki updates kaise milein?',
                answer: 'Instagram pe follow karein @sands_collections_official – wahan new arrivals, sales, aur exclusive drops ki updates milti hain.'
            },
        ]
    },
];

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg"
            >
                <span className="font-medium text-charcoal pr-8">{faq.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gold-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-medium-gray leading-relaxed pl-2">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQsPage() {
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
                            <HelpCircle className="w-4 h-4 text-gold-primary" />
                            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-primary">
                                Got Questions?
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4"
                        >
                            Frequently Asked Questions
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-medium-gray text-lg"
                        >
                            Sab sawaalon ke jawaab yahan milenge
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="container mx-auto px-4 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {faqCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gold-primary/10 rounded-full flex items-center justify-center">
                                    <category.icon className="w-6 h-6 text-gold-primary" />
                                </div>
                                <h2 className="font-playfair text-xl font-bold text-charcoal">{category.title}</h2>
                            </div>
                            <div>
                                {category.faqs.map((faq, faqIndex) => (
                                    <FAQItem key={faqIndex} faq={faq} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="max-w-4xl mx-auto mt-12 text-center">
                    <div className="bg-charcoal rounded-3xl p-8 md:p-12">
                        <Sparkles className="w-12 h-12 text-gold-primary mx-auto mb-4" />
                        <h2 className="font-playfair text-2xl font-bold text-white mb-3">Aur koi sawal hai?</h2>
                        <p className="text-white/70 mb-6">Humse seedha baat karein, hum help ke liye hamesha ready hain!</p>
                        <a
                            href="https://wa.me/923334944293"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-primary text-white font-medium rounded-full hover:bg-gold-dark transition-all"
                        >
                            <Phone size={18} />
                            WhatsApp pe message karein
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
