'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';

interface WishlistState {
    items: Product[];
    totalItems: number;
}

type WishlistAction =
    | { type: 'ADD_ITEM'; payload: Product }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'CLEAR_WISHLIST' }
    | { type: 'LOAD_WISHLIST'; payload: Product[] };

interface WishlistContextType {
    state: WishlistState;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    toggleWishlist: (product: Product) => void;
}

const initialState: WishlistState = {
    items: [],
    totalItems: 0,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const exists = state.items.find((item) => item.id === action.payload.id);
            if (exists) return state;

            const newItems = [...state.items, action.payload];
            return {
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter((item) => item.id !== action.payload);
            return {
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'CLEAR_WISHLIST':
            return initialState;

        case 'LOAD_WISHLIST':
            return {
                items: action.payload,
                totalItems: action.payload.length,
            };

        default:
            return state;
    }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(wishlistReducer, initialState);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sands-wishlist');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dispatch({ type: 'LOAD_WISHLIST', payload: parsed });
            } catch (e) {
                console.error('Failed to load wishlist:', e);
            }
        }
    }, []);

    // Save wishlist to localStorage on change
    useEffect(() => {
        localStorage.setItem('sands-wishlist', JSON.stringify(state.items));
    }, [state.items]);

    const addToWishlist = (product: Product) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    };

    const removeFromWishlist = (productId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };

    const isInWishlist = (productId: string) => {
        return state.items.some((item) => item.id === productId);
    };

    const clearWishlist = () => {
        dispatch({ type: 'CLEAR_WISHLIST' });
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                state,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
