import React, { useState } from "react";
import "./StockFilter.css"; // Importar los estilos

const StockFilter = () => {
    const [cantidad, setCantidad] = useState(0);
    const [videojuegos, setVideojuegos] = useState([]);

    const fetchVideojuegos = async () => {
        try {
            const response = await fetch(`http://localhost:8080/videoJuegos/stock/${cantidad}`);
            if (!response.ok) throw new Error("Error al obtener videojuegos");
            const data = await response.json();

            if (Array.isArray(data)) {
                setVideojuegos(data);
            } else {
                console.error("Respuesta de la API no es un array:", data);
                setVideojuegos([]);
            }
        } catch (error) {
            console.error("Error al buscar videojuegos:", error);
            setVideojuegos([]);
        }
    };

    return (
        <div className="stock-filter-container">
            <h3>Filtrar videojuegos por stock</h3>
            <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                placeholder="Cantidad máxima"
                min="1"
            />
            <button onClick={fetchVideojuegos}>Buscar</button>
            {videojuegos.length > 0 ? (
                <ul>
                    {videojuegos.map((videojuego) => (
                        <li key={videojuego.id}>
                            <h4>{videojuego.nombre}</h4>
                            <p><strong>Descripción:</strong> {videojuego.descripcion}</p>
                            <p><strong>Precio:</strong> ${videojuego.precio.toFixed(2)}</p>
                            <p><strong>Stock:</strong> {videojuego.cantidad}</p>
                            <p><strong>Categoría:</strong> {videojuego.categoria}</p>
                            <p><strong>Código:</strong> {videojuego.codigo}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-results">No se encontraron videojuegos con stock menor al indicado.</p>
            )}
        </div>
    );
};

export default StockFilter;
