// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Componentes/Login/Login";
import CreaReserva from "./Componentes/CreaReserva/CreaResreva";
import UsuarioForm from "./Componentes/UsuarioForm/UsuarioForm";
import MisReservas from "./Componentes/MisReservas/MisReservas";
import PerfilUsuario from "./Componentes/PerfilUsuario/PerfilUsuario";
import LoginSocio from "./Componentes/LoginSocio/LoginSocio";
import AdminReservas from "./Componentes/AdministrarReservas/AdministrarReserva";
import VerReservas from "./Componentes/VerReservas/VerReservas";
import AdminBarberos from "./Componentes/AdminBarberos/AdminBarberos";
import AdminCortes from "./Componentes/AdminCorteCortesia/AdminCorteCortesia";
import CreaReservaSocio from "./Componentes/CreaReservaSocio/CreaReservaSocio";
import CreaReservaAnonima from "./Componentes/ReservaAnonimaSocio/ReservaAnonimaSocio";

function App() {
  return (
    <Router> {/* Envolver las rutas con Router */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reservar" element={<CreaReserva />} />
        <Route path="/reservasCreadas" element={<MisReservas />} />
        <Route path="/registrarse" element={<UsuarioForm />} />
        <Route path="/socioLogin" element={<LoginSocio />} />
        <Route path="/adminReservas" element={<AdminReservas />} />
        <Route path="/adminBarberos" element={<AdminBarberos />} />
        <Route path="/adminCortes" element={<AdminCortes />} />
        <Route path="/miperfil" element={<PerfilUsuario />} />
        <Route path="/verReservas" element={<VerReservas />} />
        <Route path="/crearReserva" element={<CreaReservaSocio />} />
        <Route path="/reservaAnonima" element={<CreaReservaAnonima />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
