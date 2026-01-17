'use client';

import { motion } from 'framer-motion';

export function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50/50 w-full"
        >
            {/* Main Content Area */}
            {/* On mobile: full width with top padding for mobile header */}
            {/* On desktop: margin-left for fixed sidebar */}
            <div className="lg:ml-72 min-h-screen">
                <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8 xl:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

