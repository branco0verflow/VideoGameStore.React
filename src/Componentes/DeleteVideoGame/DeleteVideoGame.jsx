import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteVideoGame.css";

const DeleteVideoGame = ({ id }) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este videojuego?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/videoJuegos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el videojuego");
      }

      setSuccessMessage("Videojuego eliminado exitosamente.");
      setErrorMessage("");
      setTimeout(() => {
        navigate("/Inicio"); // Redirigir al inicio después de eliminar
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar el videojuego:", error);
      setErrorMessage("No se pudo eliminar el videojuego.");
      setSuccessMessage("");
    }
  };

  return (
    
    <div className="delete-videojuego-container">
      <h2>Eliminar Videojuego</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="delete-button" onClick={handleDelete}>
        Eliminar Videojuego
      </button>
    </div>
  );
};

export default DeleteVideoGame;
