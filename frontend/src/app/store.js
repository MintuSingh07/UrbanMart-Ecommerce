import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            cartProducts: [],

            addToCartHandler: (product) => set((state) => {
                const exists = state.cartProducts.some(item => item.productId === product.productId);
                if (!exists) {
                    return { cartProducts: [product, ...state.cartProducts] };
                }
                return state;
            }),

            removeFromCartHandler: (product) => set((state) => ({
                cartProducts: state.cartProducts.filter(item => item.productId !== product.productId),
            })),
        }),
        {
            name: "cart-item",
            // Using JSON serialization to handle objects in localStorage
            storage: {
                getItem: (name) => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                }
            }
        }
    )
);

export default useStore;
