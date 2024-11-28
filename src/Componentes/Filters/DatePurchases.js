import React, { useState } from "react";
import "./DatePurchases.css"; // Importar los estilos

const DatePurchases = () => {
    const [fecha, setFecha] = useState("");
    const [ventas, setVentas] = useState([]);

    const fetchVentas = async () => {
        try {
            // Usamos el valor de la fecha tal cual
            const response = await fetch(`http://localhost:8080/ventas/fecha/${fecha}`);
            const data = await response.json();
            console.log("Respuesta de la API:", data);

            if (Array.isArray(data)) {
                setVentas(data);
            } else {
                console.error("Respuesta de la API no es un array:", data);
                setVentas([]);
            }
        } catch (error) {
            console.error("Error al buscar ventas:", error);
            setVentas([]);
        }
    };

    return (
        <div className="date-purchases-container">
            <h3>Buscar compras por fecha</h3>
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />
            <button onClick={fetchVentas}>Buscar</button>
            <ul>
                {Array.isArray(ventas) && ventas.length > 0 ? (
                    ventas.map((venta, index) => (
                        <li key={index}>
                            <p>Usuario: {venta.nombreUsuario}</p>
                            <p>Total: ${venta.totalCompra}</p>
                            <h4>Videojuegos comprados:</h4>
                            <ul>
                                {venta.videojuegos.map((videojuego, idx) => (
                                    <li key={idx}>
                                        {videojuego.nombreVideojuego} - Cantidad: {videojuego.cantidad}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li className="no-sales">No hay ventas disponibles</li>
                )}
            </ul>
        </div>
    );
};

export default DatePurchases;
