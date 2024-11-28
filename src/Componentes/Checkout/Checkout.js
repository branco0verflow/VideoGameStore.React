import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";
import VolverButton from "../VolverButton/VolverButton";

const Checkout = ({ usuarioId }) => { // Recibir usuarioId como prop
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, totalPrice, isPremium } = location.state || {}; // Obtener carrito, precio total y estado premium

    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expirationDate: "",
        cvv: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        // Validar los datos del formulario
        if (Object.values(formData).some((field) => field.trim() === "")) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Detalles de la compra, incluyendo los videojuegos y cantidades
        const purchaseDetails = {
            usuarioId: usuarioId, // Usar el ID del usuario autenticado
            fechaCompra: new Date().toISOString().split("T")[0], // Fecha actual
            videojuegos: cart.map((product) => ({
                videojuegoId: product.id,
                cantidad: product.cantidad,
            })),
            totalPrice: totalPrice, // El precio con descuento si aplica
            isPremium: isPremium, // Agregar el valor de isPremium
        };

        try {
            const response = await fetch("http://localhost:8080/ventas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(purchaseDetails),
            });

            if (response.ok) {
                const data = await response.json();

                // Crear el mensaje con los códigos de los juegos
                const gameKeysMessage = cart
                    .map(
                        (product) =>
                            `- Código de "${product.nombre}": ${product.codigo}`
                    )
                    .join("\n");

                alert(`¡Compra realizada con éxito!\n\nClaves de los juegos:\n${gameKeysMessage}`);
                navigate("/Inicio");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "Error al procesar la compra"));
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Hubo un error en la solicitud, por favor intente más tarde.");
        }
    };

    return (
        <div className="checkout-container">
            <VolverButton />
            <h2>Página de Pago</h2>
            <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
                <label>
                    Número de Tarjeta:
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Nombre del Titular:
                    <input
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Fecha de Expiración:
                    <input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        placeholder="MM/AA"
                        required
                    />
                </label>
                <label>
                    CVV:
                    <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" onClick={handlePayment}>
                    Pagar ${totalPrice.toFixed(2)} {/* Mostrar precio con descuento */}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
