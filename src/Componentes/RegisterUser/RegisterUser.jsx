import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./RegisterUser.css"

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    tipoUsuario: "regulares", // Valor por defecto
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Estado para mostrar el formulario de pago
  const navigate = useNavigate(); // Inicializar el hook de navegación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Mostrar el formulario de pago si se selecciona "premium"
    if (name === "tipoUsuario" && value === "premium") {
      setShowPaymentForm(true);
    } else {
      setShowPaymentForm(false);
    }
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

      // Asignar mensajes específicos según el tipo de usuario
      if (formData.tipoUsuario === "premium") {
        setSuccessMessage(`¡Pago realizado! Usuario premium registrado correctamente: ${data.nombre}`);
      } else {
        setSuccessMessage(`Usuario regular registrado correctamente: ${data.nombre}`);
      }

      setErrorMessage("");
      setFormData({
        email: "",
        password: "",
        nombre: "",
        tipoUsuario: "regulares",
      });
      setShowPaymentForm(false);

      // Mostrar mensaje y redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }
  };

  const handlePaymentAndRegistration = async (e) => {
    e.preventDefault();
    await handleSubmit(e); // Registrar el usuario al realizar el pago
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

        {/* Mostrar botón de registro solo si no es premium */}
        {!showPaymentForm && <button type="submit">Registrarse</button>}
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Mostrar formulario de pago solo si el tipo de usuario es premium */}
      {showPaymentForm && (
        <div className="payment-container">
          <h2>Formulario de Pago</h2>
          <form onSubmit={handlePaymentAndRegistration} className="payment-form">
            <label>
              Número de Tarjeta:
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9876 5432"
                required
              />
            </label>
            <label>
              Nombre del Titular:
              <input
                type="text"
                name="cardHolder"
                placeholder="Nombre del Titular"
                required
              />
            </label>
            <label>
              Fecha de Expiración:
              <input
                type="text"
                name="expirationDate"
                placeholder="MM/AA"
                required
              />
            </label>
            <label>
              CVV:
              <input
                type="password"
                name="cvv"
                placeholder="123"
                required
              />
            </label>
            <button type="submit">
              Pagar $10 y registrarse
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
