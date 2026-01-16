'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartState, Product } from '@/lib/types';

// Cart Actions
type CartAction =
    | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string; color?: string } }
    | { type: 'REMOVE_ITEM'; payload: { productId: string; size?: string; color?: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; size?: string; color?: string } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartState };

// Cart Context Type
interface CartContextType {
    state: CartState;
    addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
    removeItem: (productId: string, size?: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string, size?: string, color?: string) => number;
}

// Initial State
const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

// Calculate Totals
function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    return items.reduce(
        (acc, item) => ({
            totalItems: acc.totalItems + item.quantity,
            totalPrice: acc.totalPrice + (item.product.salePrice || item.product.price) * item.quantity,
        }),
        { totalItems: 0, totalPrice: 0 }
    );
}

// Cart Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, quantity, size, color } = action.payload;
            const existingItemIndex = state.items.findIndex(
                item =>
                    item.product.id === product.id &&
                    item.selectedSize === size &&
                    item.selectedColor === color
            );

            let newItems: CartItem[];

            if (existingItemIndex > -1) {
                // Update existing item quantity
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                newItems = [...state.items, { product, quantity, selectedSize: size, selectedColor: color }];
            }

            const totals = calculateTotals(newItems);
            return { items: newItems, ...totals };
        }

        case 'REMOVE_ITEM': {
            const { productId, size, color } = action.payload;
            const newItems = state.items.filter(
                item =>
                    !(item.product.id === productId &&
                        item.selectedSize === size &&
                        item.selectedColor === color)
            );
            const totals = calculateTotals(newItems);
            return { items: newItems, ...totals };
        }

        case 'UPDATE_QUANTITY': {
            const { productId, quantity, size, color } = action.payload;
            if (quantity <= 0) {
                return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId, size, color } });
            }
            const newItems = state.items.map(item =>
                item.product.id === productId &&
                    item.selectedSize === size &&
                    item.selectedColor === color
                    ? { ...item, quantity }
                    : item
            );
            const totals = calculateTotals(newItems);
            return { items: newItems, ...totals };
        }

        case 'CLEAR_CART':
            return initialState;

        case 'LOAD_CART':
            return action.payload;

        default:
            return state;
    }
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('sands_cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch (e) {
                console.error('Failed to parse saved cart:', e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('sands_cart', JSON.stringify(state));
    }, [state]);

    const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } });
    };

    const removeItem = (productId: string, size?: string, color?: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });
    };

    const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, size, color } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const isInCart = (productId: string) => {
        return state.items.some(item => item.product.id === productId);
    };

    const getItemQuantity = (productId: string, size?: string, color?: string) => {
        const item = state.items.find(
            item =>
                item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
        );
        return item?.quantity || 0;
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isInCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use cart
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
