import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../Componentes/UsuarioContext/UsuarioContext";
import "./Login.css"; 
import imgLogo from '../../Images/logo.png';

const Login = () => {
  const { setUsuario } = useUsuario(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://albo-barber.onrender.com/usuarios/login/${username}/${password}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Usuario o contraseña incorrectos");
        } else {
          throw new Error("Error al conectar con la API");
        }
        return;
      }

      const usuario = await response.json();
      setUsuario(usuario); 
      navigate("/reservar"); 
    } catch (err) {
      console.error("Error detallado:", err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={imgLogo} alt="Logo de la empresa" className="logo" />
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Iniciar Sesión</button>
        <div className="links-container">
          <p onClick={() => navigate("/socioLogin")} className="link">¿Eres barbero?</p>
          <p>¿Aún no tienes cuenta? <span onClick={() => navigate("/registrarse")} className="link">Regístrate</span></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
