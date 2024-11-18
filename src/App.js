import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoGameList from "./Componentes/Card/VideoGameList";
import BannerInicio from "./Componentes/BannerInicio/BannerInicio";
import LoginAdmin from "./Componentes/LoginAdmin/LoginAdmin";
import VideoGameDetail from "./Componentes/DetailGame/VideoGameDetail";
import AddVideoGame from "./Componentes/AddVideoGame/AddVideoGame";
import EditVideoGame from "./Componentes/EditVideoGame/EditVideoGame";
import Footer from "./Componentes/NavBar/Footer";
import "./App.css";
import NavbarCustom from "./Componentes/NavBar/NavBar";
import RegisterUser from "./Componentes/RegisterUser/RegisterUser";

function App() {
    const [user, setUser] = useState(false);

    // Función para manejar el inicio de sesión
    const handleLogin = async (email, password) => {
        try {
            // Enviar credenciales al backend
            const response = await fetch('http://localhost:8080/api/administradores/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const isAuthenticated = await response.json();
            if (isAuthenticated) {
                alert("Inicio de sesión exitoso");
                setUser(true); // Cambia el estado a autenticado
            } else {
                alert("Credenciales inválidas");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        setUser(false); // Cambia el estado a no autenticado
        alert("Sesión cerrada");
    };

    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<NavbarCustom user={user} handleLogout={handleLogout} />}>

                    <Route path="/Inicio" element={<BannerInicio user={user} />} />
                    <Route path="/login" />
                    <Route path="/administradoresAutorizados" element={<LoginAdmin handleLogin={handleLogin} />} />
                    <Route path="*" element={<div>Pagina no encontrada</div>} />
                    <Route path="/detalle/:id" element={<VideoGameDetail />} />
                    <Route path="/agregarVideojuego" element={<AddVideoGame />} />
                    <Route path="/editarVideojuego/:id" element={<EditVideoGame />} />
                    <Route path="/registrarUsuario" element={<RegisterUser />} />

                    
                </Route>
                
            </Routes>
            
        </BrowserRouter>
    );
}

export default App;

