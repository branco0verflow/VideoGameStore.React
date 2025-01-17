import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext"; // Asegúrate de que esta ruta sea correcta
import "./AdministrarReservas.css";
import imgLogo from "../../Images/logo.png"; // Asegúrate de que esta ruta sea correcta

const AdminReservas = () => {
  const { socio, setSocio } = useSocio(); // Contexto de socio
  const navigate = useNavigate();

  const handleLogout = () => {
    setSocio(null); // Limpiar el socio del contexto
    navigate("/socioLogin"); // Redirigir a la página de login
  };

  return (
    <div className="admin-reservas-container">
      <img src={imgLogo} alt="Logo de la barbería" className="logo" />
      <h2>Administración</h2>
      <div className="button-group">
        <button onClick={() => navigate("/VerReservas")}>Ver Reservas</button>
        <button onClick={() => navigate("/registrarse")}>Crear Usuario</button>
        {socio?.admin && (
          <button onClick={() => navigate("/adminBarberos")}>
            Administrar Barberos
          </button>
        )}
        {socio?.admin && (
          <button onClick={() => navigate("/adminCortes")}>
            Administrar Cortes
          </button>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default AdminReservas;
