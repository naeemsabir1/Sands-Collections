'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setPosition({ x, y });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-zoom-in ${className}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                style={{
                    transformOrigin: `${position.x}% ${position.y}%`,
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
            />
        </div>
    );
}
