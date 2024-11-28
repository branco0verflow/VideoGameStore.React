import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginUser.css"; 

const LoginUser = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const isAuthenticated = await handleLogin(email, password);
    if (isAuthenticated) {
      const user = { email, isPremium: true };
      localStorage.setItem("user", JSON.stringify(user));
      navigate(`/Inicio`);
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión - Usuario</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
