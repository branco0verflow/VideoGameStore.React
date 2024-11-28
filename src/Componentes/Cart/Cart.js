import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cartContext";
import "./Cart.css";
import VolverButton from "../VolverButton/VolverButton";

const Cart = ({ isPremium }) => {
    const { cart, addToCart, removeFromCart, removeAllFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Agrupar los videojuegos por nombre y contar la cantidad
    const groupedCart = cart.reduce((acc, game) => {
        const found = acc.find((item) => item.nombre === game.nombre);
        if (found) {
            found.cantidad += 1;
        } else {
            acc.push({ ...game, cantidad: 1 });
        }
        return acc;
    }, []);

    // Calcular el precio total
    const totalPrice = groupedCart.reduce((total, game) => total + game.precio * game.cantidad, 0);

    // Precio con descuento del 20% si el usuario es premium
    const discountedPrice = isPremium ? totalPrice * 0.8 : totalPrice;

    // Función para manejar el checkout
    const handleCheckout = () => {
    if (groupedCart.length > 0) {
        navigate("/checkout", {
            state: {
                cart: groupedCart,
                totalPrice: discountedPrice, // Precio calculado con descuento si aplica
                isPremium, // Estado del usuario premium
            },
        });
    } else {
        alert("El carrito está vacío.");
    }
};


    return (
        <div className="cart-container">
            <VolverButton />
            <h2 className="cart-title">🛒 Tu Carrito de Compras</h2>
            {groupedCart.length === 0 ? (
                <p className="cart-empty">El carrito está vacío.</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedCart.map((game, index) => (
                            <tr key={index} className="cart-item">
                                <td>{game.nombre}</td>
                                <td>
                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-button"
                                            onClick={() => removeFromCart(game)}
                                        >
                                            -
                                        </button>
                                        {game.cantidad}
                                        <button
                                            className="quantity-button"
                                            onClick={() => addToCart(game)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>${game.precio.toFixed(2)}</td>
                                <td>${(game.precio * game.cantidad).toFixed(2)}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => removeAllFromCart(game)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="cart-total">
                <h3>Total:</h3>
                {isPremium ? (
                    <div className="discounted-price">
                        <span className="original-price">${totalPrice.toFixed(2)}</span>
                        <span className="new-price">${discountedPrice.toFixed(2)}</span>
                    </div>
                ) : (
                    <span>${totalPrice.toFixed(2)}</span>
                )}
            </div>

            <button className="checkout-button" onClick={handleCheckout}>
                Finalizar Compra
            </button>
        </div>
    );
};

export default Cart;
