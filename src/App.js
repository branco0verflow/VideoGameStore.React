import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoGameList from "./Componentes/Card/VideoGameList";
import BannerInicio from "./Componentes/BannerInicio/BannerInicio";
import LoginAdmin from "./Componentes/LoginAdmin/LoginAdmin";
import LoginUser from "./Componentes/LoginUser/LoginUser"; 
import VideoGameDetail from "./Componentes/DetailGame/VideoGameDetail";
import AddVideoGame from "./Componentes/AddVideoGame/AddVideoGame";
import EditVideoGame from "./Componentes/EditVideoGame/EditVideoGame";
import Footer from "./Componentes/NavBar/Footer";
import "./App.css";
import NavbarCustom from "./Componentes/NavBar/NavBar";
import RegisterUser from "./Componentes/RegisterUser/RegisterUser";
import { CartProvider } from "./context/cartContext";
import Cart from "./Componentes/Cart/Cart";
import Checkout from "./Componentes/Checkout/Checkout";
import Dashboard from "./Componentes/Filters/DashBoard";
import ManageVideoGames from "./Componentes/Filters/ManageVideoGames";
import ManageUsers from "./Componentes/Filters/ManageUsers";
import EditUser from "./Componentes/Filters/EditUser";

function App() {
    const [user, setUser] = useState(false); // Usuario inicial no autenticado

    // Función para manejar el inicio de sesión de administradores
    const handleAdminLogin = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/administradores/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const isAuthenticated = await response.json();
            if (isAuthenticated) {
                alert("Inicio de sesión de administrador exitoso");
                setUser({ isAuthenticated: true, role: "admin" }); // Agregamos el rol
            } else {
                alert("Credenciales de administrador inválidas");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    // Función para manejar el inicio de sesión de usuarios
    const handleUserLogin = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
    
            if (response.ok && data) {
                alert("Inicio de sesión de usuario exitoso");
                setUser({
                    isAuthenticated: true,
                    role: "user",
                    isPremium: data.premium,
                    usuarioId: data.id,  // Suponiendo que el backend devuelve el ID del usuario
                });
                return true;
            } else {
                alert("Credenciales de usuario inválidas");
                setUser(false);
                return false;
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return false;
        }
    };
    

    // Función para cerrar sesión
    const handleLogout = () => {
        setUser(false); // Restablece el estado de usuario
        localStorage.removeItem("user"); // Elimina los datos del usuario del localStorage
        alert("Sesión cerrada");
    };
    
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                        <Route path="/" element={<NavbarCustom user={user} handleLogout={handleLogout} />}>
                        <Route index element={<BannerInicio user={user} />} />
                        <Route path="/Inicio" element={<BannerInicio user={user} />} />
                        <Route path="/videogames" element={<VideoGameList user={user} />} />
                        <Route path="/login" element={<LoginUser handleLogin={handleUserLogin} />} />
                        <Route path="/administradoresAutorizados" element={<LoginAdmin handleLogin={handleAdminLogin} />} />
                        <Route path="*" element={<div>Página no encontrada</div>} />
                        <Route path="/detalle/:id" element={<VideoGameDetail />} />
                        <Route path="/agregarVideojuego" element={<AddVideoGame />} />
                        <Route path="/editarVideojuego/:id" element={<EditVideoGame />} />
                        <Route path="/registrarUsuario" element={<RegisterUser />} />
                        <Route path="/cart" element={<Cart isPremium={user?.isPremium || false} />} />
                        <Route path="/checkout" element={<Checkout usuarioId={user?.usuarioId} />} />
                        <Route path="/administrar-videojuegos" element={<ManageVideoGames />} />
                        <Route path="/confirmation" element={<div>Compra realizada con éxito</div>} />
                        <Route 
                            path="/dashboard" 
                            element={user && user.role === "admin" ? <Dashboard /> : <div>No tienes acceso</div>} 
                        />
                        <Route path="/administrar-usuarios" element={<ManageUsers />} />
                        <Route path="/edit-user/:id" element={<EditUser />} />
                        <Route path="/register" element={<RegisterUser />} />

                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}


export default App;