import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Agregar un videojuego al carrito
    const addToCart = (game) => {
        setCart([...cart, game]);
    };

    // Eliminar un videojuego (solo una unidad) del carrito
    const removeFromCart = (game) => {
        const index = cart.findIndex((item) => item.nombre === game.nombre);
        if (index !== -1) {
            const newCart = [...cart];
            newCart.splice(index, 1);
            setCart(newCart);
        }
    };

    // Eliminar todos los videojuegos de un tipo
    const removeAllFromCart = (game) => {
        const newCart = cart.filter((item) => item.nombre !== game.nombre);
        setCart(newCart);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeAllFromCart }}>
            {children}
        </CartContext.Provider>
    );
};