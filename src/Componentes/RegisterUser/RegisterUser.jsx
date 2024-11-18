import React, { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    tipoUsuario: "regulares", // Valor por defecto
    numeroTarjeta: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el usuario.");
      }

      const data = await response.json();
      setSuccessMessage(`Usuario registrado con éxito: ${data.nombre}`);
      setErrorMessage("");
      setFormData({
        email: "",
        password: "",
        nombre: "",
        tipoUsuario: "regulares",
        numeroTarjeta: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Regístrate</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Tipo de Usuario:
          <select
            name="tipoUsuario"
            value={formData.tipoUsuario}
            onChange={handleInputChange}
            required
          >
            <option value="regulares">Regular</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        {formData.tipoUsuario === "premium" && (
          <label>
            Número de Tarjeta:
            <input
              type="text"
              name="numeroTarjeta"
              value={formData.numeroTarjeta}
              onChange={handleInputChange}
              required
            />
          </label>
        )}
        <button type="submit">Registrarse</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RegisterUser;
