'use client';

import { useState } from 'react';
import { seedDatabase } from '@/lib/seed';
import { Loader2, CheckCircle, XCircle, Database, Trash2, Package } from 'lucide-react';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setStatus('seeding');
        setMessage('Clearing existing data and seeding fresh products...');

        try {
            const success = await seedDatabase();
            if (success) {
                setStatus('success');
                setMessage('Database seeded successfully! All products are now linked and ready.');
            } else {
                setStatus('error');
                setMessage('Failed to seed database. Check the console for errors.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(`Error: ${error}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal via-gray-900 to-black flex items-center justify-center p-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 max-w-lg w-full text-center border border-white/10 shadow-2xl">

                {/* Header */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-primary to-amber-600 flex items-center justify-center shadow-lg shadow-gold-primary/30">
                    <Database size={36} className="text-white" />
                </div>

                <h1 className="font-playfair text-3xl font-bold text-white mb-2">
                    Database Seed Tool
                </h1>
                <p className="text-white/60 mb-8 leading-relaxed">
                    This will <span className="text-rose-400 font-medium">clear all existing products</span> and populate your Firestore with fresh sample data.
                </p>

                {/* Status Display */}
                {status === 'idle' && (
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 text-left space-y-3 border border-white/10">
                            <div className="flex items-center gap-3 text-white/80">
                                <Trash2 size={18} className="text-rose-400" />
                                <span>Clears all existing data</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <Package size={18} className="text-emerald-400" />
                                <span>Adds 31 products across categories</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <CheckCircle size={18} className="text-blue-400" />
                                <span>Adds 3 hero slides, 6 categories, 4 featured</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <CheckCircle size={18} className="text-gold-primary" />
                                <span>Links all content to admin panel</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSeed}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-primary to-amber-600 text-white font-bold text-lg shadow-lg shadow-gold-primary/30 hover:shadow-xl hover:shadow-gold-primary/40 transition-all hover:-translate-y-1"
                        >
                            🌱 Seed Database
                        </button>
                    </div>
                )}

                {status === 'seeding' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 size={48} className="animate-spin text-gold-primary" />
                        <p className="text-white/80 animate-pulse">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle size={36} className="text-emerald-400" />
                            </div>
                            <p className="text-emerald-400 font-medium">{message}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href="/admin"
                                className="py-3 px-6 rounded-xl bg-gold-primary text-white font-bold hover:bg-gold-dark transition-colors"
                            >
                                View Admin
                            </a>
                            <a
                                href="/"
                                className="py-3 px-6 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/20"
                            >
                                View Site
                            </a>
                        </div>

                        <p className="text-white/40 text-sm">
                            Products are now linked to <code className="text-gold-primary">/products/[id]</code>
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <XCircle size={36} className="text-rose-400" />
                            </div>
                            <p className="text-rose-400">{message}</p>
                        </div>
                        <button
                            onClick={handleSeed}
                            className="py-3 px-8 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/20"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Warning */}
                {status === 'idle' && (
                    <p className="text-amber-400/80 text-xs mt-6 flex items-center justify-center gap-2">
                        ⚠️ This action is irreversible
                    </p>
                )}
            </div>
        </div>
    );
}
