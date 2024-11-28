import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePurchases from "./DatePurchases";
import StockFilter from "./StockFilter";
import UserFilter from "./UserFilter";
import UserPurchases from "./UserPurchases";
import VolverButton from "../VolverButton/VolverButton";
import "./DashBoard.css";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="dashboard-container">
      <VolverButton />
      <h1>Dashboard Administrativo</h1>
      
      <div className="admin-links">
        <Link to="/administrar-videojuegos">
          <button className="manage-video-games-button">Administrar Videojuegos</button>
        </Link>
        <Link to="/administrar-usuarios">
          <button className="manage-users-button">Administrar Usuarios</button>
        </Link>
      </div>

      {/* Menú desplegable para opciones de filtros */}
      <div className="menu">
        <button onClick={() => handleSelectOption("datePurchases")} className="menu-button">
          Filtrar Compras por Fecha
        </button>
        <button onClick={() => handleSelectOption("stockFilter")} className="menu-button">
          Filtrar Videojuegos por Stock
        </button>
        <button onClick={() => handleSelectOption("userFilter")} className="menu-button">
          Filtrar Usuarios por Tipo
        </button>
        <button onClick={() => handleSelectOption("userPurchases")} className="menu-button">
          Filtrar Compras por Usuario
        </button>
      </div>

      {/* Condicionalmente renderizamos los filtros */}
      {selectedOption === "datePurchases" && (
        <div className="filters">
          <DatePurchases />
        </div>
      )}

      {selectedOption === "stockFilter" && (
        <div className="filters">
          <StockFilter />
        </div>
      )}

      {selectedOption === "userFilter" && (
        <div className="filters">
          <UserFilter />
        </div>
      )}

      {selectedOption === "userPurchases" && (
        <div className="filters">
          <UserPurchases />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
