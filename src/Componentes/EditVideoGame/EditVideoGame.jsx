import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditVideoGame.css";

const EditVideoGame = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    cantidad: "",
    categoria: "",
    ventas: [{ cantidadVendida: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener los datos actuales del videojuego
  useEffect(() => {
    const fetchVideoGame = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videoJuegos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del videojuego");
        }
        const data = await response.json();
        setFormData({
          ...data,
          ventas: [{ cantidadVendida: data.ventas[0]?.cantidadVendida || "" }],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del videojuego:", error);
        setErrorMessage("No se pudo cargar el videojuego.");
        setLoading(false);
      }
    };


    fetchVideoGame();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Manejar el campo de ventas separadamente
    if (name === "cantidadVendida") {
      setFormData({
        ...formData,
        ventas: [{ cantidadVendida: value }],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/videoJuegos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el videojuego");
      }

      setSuccessMessage("Videojuego actualizado exitosamente.");
      setErrorMessage("");
      setTimeout(() => {
        navigate("/"); // Redirigir al inicio después de 2 segundos
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el videojuego:", error);
      setErrorMessage("No se pudo actualizar el videojuego.");
      setSuccessMessage("");
    }
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="edit-videojuego-container">
      <h2>Editar Videojuego</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Código:
          <input
            type="number"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            step="0.01"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Imagen URL:
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cantidad Disponible:
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Categoría:
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ventas - Cantidad Vendida:
          <input
            type="number"
            name="cantidadVendida"
            value={formData.ventas[0].cantidadVendida}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditVideoGame;
