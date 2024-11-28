import React, { useState } from "react";
import "./UserPurchases.css"; // Importar los estilos

const UserPurchases = () => {
    const [usuarioId, setUsuarioId] = useState("");
    const [ventas, setVentas] = useState([]);

    const fetchVentas = async () => {
        const response = await fetch(`http://localhost:8080/ventas/usuario/${usuarioId}`);
        const data = await response.json();
        setVentas(data);
    };

    return (
        <div className="user-purchases-container">
            <h3>Buscar compras por usuario</h3>
            <input
                type="number"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                placeholder="ID de Usuario"
                min="1"
            />
            <button onClick={fetchVentas}>Buscar</button>
            <ul>
                {ventas.length > 0 ? (
                    ventas.map((venta, index) => (
                        <li key={index}>
                            <p><strong>Usuario:</strong> {venta.nombreUsuario}</p>
                            <p><strong>Fecha de Compra:</strong> {venta.fechaCompra}</p>
                            <p><strong>Total:</strong> ${venta.totalCompra}</p>
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
                    <p className="no-results">No hay compras disponibles para este usuario.</p>
                )}
            </ul>
        </div>
    );
};

export default UserPurchases;
