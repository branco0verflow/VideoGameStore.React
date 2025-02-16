import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../Componentes/UsuarioContext/UsuarioContext";
import "./Login.css"; 
import imgLogo from '../../Images/logo.png';
import imag1 from '../../Images/Albo1.jpg';
import imag2 from '../../Images/Albo2.jpg';
import imag3 from '../../Images/Albo3.jpg';

const Login = () => {
  const { setUsuario } = useUsuario(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

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


  const leftImages = [
    imag1,
    imag2,
    imag3,
  ];

  const rightImages = [
    imag2,
    imag3,
    imag1,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex((prevIndex) => (prevIndex + 1) % leftImages.length);
      setRightImageIndex((prevIndex) => (prevIndex + 1) % rightImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [leftImages.length, rightImages.length]);

  return (
    <div className="background-carousel">
      <div
        className="background-half left"
        style={{ backgroundImage: `url(${leftImages[leftImageIndex]})` }}
      ></div>
      <div
        className="background-half right"
        style={{ backgroundImage: `url(${rightImages[rightImageIndex]})` }}
      ></div>
      <div className="login-container-principal">
      <form className="login-form-principal" onSubmit={handleSubmit}>
        <img src={imgLogo} alt="Logo de la empresa" className="logo" />
        <h2>Inicia Sesión</h2>
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
    </div>
  );
};

export default Login;
