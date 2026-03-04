import React from 'react';

interface LogoIconProps {
    className?: string;
}

export function LogoIcon({ className = '' }: LogoIconProps) {
    return (
        <svg
            viewBox="0 0 100 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="xMidYMid meet"
        >
            <path
                d="M50 10 C38 10 30 20 30 35 C30 55 70 70 70 105 C70 130 55 140 40 140 C28 140 20 130 20 115"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Intricate swooshes mimicking calligraphic style */}
            <path
                d="M30 35 C20 10 45 0 50 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="transparent"
            />
            <path
                d="M20 115 C10 145 50 155 40 140"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="transparent"
            />

            {/* Swirls and flourishes */}
            <path
                d="M50 10 C55 30 40 40 30 35"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="transparent"
            />
            <path
                d="M40 140 C35 120 45 110 55 115"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="transparent"
            />

            {/* Decorative dots / accents */}
            <circle cx="50" cy="10" r="1.5" fill="currentColor" />
            <circle cx="40" cy="140" r="1.5" fill="currentColor" />

            {/* Main flourish overlapping */}
            <path
                d="M30 75 Q45 50 60 70 T35 110"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="transparent"
            />
            <path
                d="M75 55 Q85 80 65 95"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="transparent"
            />
            <path
                d="M65 95 Q80 110 90 85"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="transparent"
            />
        </svg>
    );
}
