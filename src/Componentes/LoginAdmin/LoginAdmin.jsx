import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginAdmin.css";

const LoginAdmin = ({ handleLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password);
        navigate(`/Inicio`);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesión - Admin</h2>
                <form onSubmit={onSubmit}>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="login-button" type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;