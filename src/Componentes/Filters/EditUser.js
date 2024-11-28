import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditUser.css"; // Opcional: agregar estilos personalizados

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    isPremium: false,
    numeroTarjeta: "",
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${id}`);
        if (!response.ok) throw new Error("Error al obtener el usuario");
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setErrorMessage("No se pudo cargar el usuario.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el usuario");

      setSuccessMessage("Usuario actualizado exitosamente.");
      setTimeout(() => {
        navigate("/"); // Redirigir al Dashboard
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setErrorMessage("No se pudo actualizar el usuario.");
    }
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="edit-user-container">
      <h2>Editar Usuario</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
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
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Usuario Premium:
          <input
            type="checkbox"
            name="isPremium"
            checked={formData.isPremium}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditUser;
