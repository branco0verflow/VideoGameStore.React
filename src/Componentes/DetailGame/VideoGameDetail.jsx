import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VideoGameDetail.css"; // Opcional: agrega estilos personalizados

const VideoGameDetail = () => {
  const { id } = useParams(); // Obtener el ID desde la URL
  const [videojuego, setVideojuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideojuego = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videoJuegos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el videojuego");
        }
        const data = await response.json();
        setVideojuego(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener el videojuego:", err);
        setError("No se pudo cargar la información del videojuego.");
        setLoading(false);
      }
    };

    fetchVideojuego();
  }, [id]);

  if (loading) return <div>Cargando...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="videojuego-detalle">
      <button className="back-button" onClick={() => navigate(-1)}>
        Volver
      </button>
      <div className="videojuego-card">
        <img
          src={videojuego.imagen}
          alt={videojuego.nombre}
          className="videojuego-imagen"
        />
        <div className="videojuego-info">
          <h2>{videojuego.nombre}</h2>
          <p>
            <strong>Código:</strong> {videojuego.codigo}
          </p>
          <p>
            <strong>Descripción:</strong> {videojuego.descripcion}
          </p>
          <p>
            <strong>Precio:</strong> ${videojuego.precio}
          </p>
          <p>
            <strong>Categoría:</strong> {videojuego.categoria}
          </p>
          <p>
            <strong>Cantidad Disponible:</strong> {videojuego.cantidad}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoGameDetail;
