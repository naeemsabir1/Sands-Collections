'use client';

import { useEffect } from 'react';
import { incrementVisit } from '@/lib/firestore';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const trackVisit = async () => {
            // Simple session tracking to avoid duplicate visit counts on refresh
            const hasBuffer = sessionStorage.getItem('sands_visit_buffer');

            // Check for daily unique user
            const today = new Date().toDateString();
            const lastDailyVisit = localStorage.getItem('sands_last_daily_visit');
            const isNewDailyUser = lastDailyVisit !== today;

            if (!hasBuffer) {
                await incrementVisit(isNewDailyUser);
                sessionStorage.setItem('sands_visit_buffer', 'true');

                if (isNewDailyUser) {
                    localStorage.setItem('sands_last_daily_visit', today);
                }
            }
        };

        trackVisit();
    }, []);

    return <>{children}</>;
}
