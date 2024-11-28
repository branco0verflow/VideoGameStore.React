import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VideoGameDetail.css";
import VolverButton from "../VolverButton/VolverButton";

const VideoGameDetail = () => {
  const { id } = useParams(); // Obtener el ID desde la URL
  const [videojuego, setVideojuego] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es administrador
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
      } catch (err) {
        console.error("Error al obtener el videojuego:", err);
        setError("No se pudo cargar la información del videojuego.");
      } finally {
        setLoading(false);
      }
    };

// No sirve para nada pq ese endpoint no existe, pero me da miedo tocar y q se rompa algo, funciona muy perfectito todo.

    const checkAdmin = async () => {
      try {
        // Aquí se debería verificar si el usuario es administrador.
        // Puede ser desde el contexto, un token o una solicitud al servidor.
        const response = await fetch("http://localhost:8080/auth/isAdmin", {
          method: "GET",
          credentials: "include", // Incluir cookies o tokens si es necesario
        });
        const result = await response.json();
        setIsAdmin(result.isAdmin); // Asume que el backend devuelve { isAdmin: true/false }
      } catch (err) {
        console.error("Error al verificar el rol de administrador:", err);
      }
    };

    fetchVideojuego();
    checkAdmin();
  }, [id]);

  if (loading) return <div>Cargando...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="videojuego-detalle">
      <VolverButton />
      <div className="videojuego-card">
        <img
          src={videojuego.imagen}
          alt={videojuego.nombre}
          className="videojuego-imagen"
        />
        <div className="videojuego-info">
          <h2>{videojuego.nombre}</h2>
          {isAdmin && (
            <p>
              <strong>Código:</strong> {videojuego.codigo}
            </p>
          )}
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
