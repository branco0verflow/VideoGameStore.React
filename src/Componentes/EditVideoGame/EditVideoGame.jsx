import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditVideoGame.css";
import VolverButton from "../VolverButton/VolverButton";

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
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Expresión regular para validar el formato del código
  const codigoRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

  // Obtener los datos actuales del videojuego
  useEffect(() => {
    const fetchVideoGame = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videoJuegos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del videojuego");
        }
        const data = await response.json();
        setFormData({ ...data });
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    if (!codigoRegex.test(formData.codigo)) {
      setErrorMessage("El código debe seguir el formato AAAA-AAAA-AAAA-AAAA (solo letras mayúsculas y números).");
      return false;
    }
    if (formData.nombre.trim().length < 3) {
      setErrorMessage("El nombre debe tener al menos 3 caracteres.");
      return false;
    }
    if (formData.descripcion.trim().length < 10) {
      setErrorMessage("La descripción debe tener al menos 10 caracteres.");
      return false;
    }
    if (formData.precio <= 0) {
      setErrorMessage("El precio debe ser un número positivo.");
      return false;
    }
    if (formData.cantidad < 0) {
      setErrorMessage("La cantidad debe ser un número positivo.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviarlo
    if (!validateForm()) return;

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
      <VolverButton />
      <h2>Editar Videojuego</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Clave:
          <input
            type="text"
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
          Género:
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Deportes">Deportes</option>
            <option value="Puzzle">Puzzle</option>
            <option value="RPG">RPG</option>
          </select>
        </label>
        <button type="submit" className="submit-button">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditVideoGame;
