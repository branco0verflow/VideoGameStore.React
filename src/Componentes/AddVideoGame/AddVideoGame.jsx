import React, { useState } from "react";
import "./AddVideoGame.css"; // Opcional: agrega estilos personalizados

const AddVideoGame = () => {
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

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await fetch("http://localhost:8080/videoJuegos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el videojuego");
      }

      setSuccessMessage("Videojuego agregado exitosamente.");
      setErrorMessage("");
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        cantidad: "",
        categoria: "",
        ventas: [{ cantidadVendida: "" }],
      });
    } catch (error) {
      console.error("Error al agregar el videojuego:", error);
      setSuccessMessage("");
      setErrorMessage("No se pudo agregar el videojuego.");
    }
  };

  return (
    <div className="add-videojuego-container">
      <h2>Agregar Videojuego</h2>
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
          Agregar Videojuego
        </button>
      </form>
    </div>
  );
};

export default AddVideoGame;
