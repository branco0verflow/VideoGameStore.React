import React, { useState } from "react";
import "./AddVideoGame.css"; // Opcional: agrega estilos personalizados

const AddVideoGame = () => {
  const [formData, setFormData] = useState({
    codigo: "", // El código se llenará automáticamente
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    cantidad: "",
    categoria: "Acción",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Función para generar una clave aleatoria en el formato AAAA-AAAA-AAAA-AAAA
  const generarClaveAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let clave = '';
    for (let i = 0; i < 4; i++) {
      let segmento = '';
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        segmento += caracteres[randomIndex];
      }
      clave += segmento + (i < 3 ? '-' : '');  // Añadir guiones entre los segmentos
    }
    return clave;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generar una clave aleatoria antes de enviar el formulario
    const claveGenerada = generarClaveAleatoria();

    // Añadir la clave generada al formulario
    const videojuegoConClave = { ...formData, codigo: claveGenerada };

    try {
      const response = await fetch("http://localhost:8080/videoJuegos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videojuegoConClave),
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
        categoria: "Acción", // Reinicia el valor inicial
      });
    } catch (error) {
      console.error("Error al agregar el videojuego:", error);
      setSuccessMessage("");
      setErrorMessage("No se pudo agregar el videojuego.");
    }
  };

  return (
    <div className="add-video-game-container">
      <h2>Agregar Videojuego</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>

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
            min="0"
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
          Agregar Videojuego
        </button>
      </form>
    </div>
  );
};

export default AddVideoGame;
