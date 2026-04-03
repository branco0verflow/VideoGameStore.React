import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import imgLogo from '../../Images/logo.png';
import imag1 from '../../Images/Albo1.jpg';
import imag2 from '../../Images/Albo2.jpg';
import imag3 from '../../Images/Albo3.jpg';

const LoginSocio = () => {
  const { setSocio } = useSocio();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);

  const images = [imag1, imag2, imag3];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`https://albo-barber.onrender.com/api/socios/login/${username}/${password}`);
      if (!r.ok) { setError(r.status === 404 ? "Usuario o contraseña incorrectos" : "Error de conexión"); return; }
      setSocio(await r.json());
      navigate("/VerReservas");
    } catch { setError("Error al conectar con el servidor"); }
  };

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 brightness-[0.45] scale-105"
          style={{ backgroundImage: `url(${images[imgIdx]})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
        <div className="absolute bottom-10 left-10">
          <p className="font-oswald text-white/20 text-xs tracking-widest uppercase">
            Albo Barbería · Panel Barberos
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full md:w-1/2 bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[340px]">
          <div className="mb-10">
            <img src={imgLogo} alt="Albo Barbería" className="w-24 mb-6 opacity-90" />
            <h1 className="font-oswald font-semibold text-3xl text-white mb-1">
              Acceso Barberos
            </h1>
            <p className="font-lato text-white/40 text-sm font-light">Panel de administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="font-lato text-red-300 text-sm">{error}</p>
              </div>
            )}
            <div>
              <label className="field-label" htmlFor="username">Usuario</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                required placeholder="tu_usuario" className="input-field" />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Contraseña</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••" className="input-field" />
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-primary">Iniciar Sesión</button>
            </div>
          </form>

          <div className="mt-8 space-y-3">
            <div className="h-px bg-white/[0.06]" />
            <button onClick={() => navigate("/")}
              className="w-full font-lato text-white/40 text-sm hover:text-white/70 transition-colors py-1 text-left">
              ← Volver al login de usuarios
            </button>
            <button onClick={() => navigate("/registrarse")}
              className="w-full font-lato text-white/40 text-sm hover:text-white/70 transition-colors py-1 text-left">
              ¿Sin cuenta? Regístrate →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSocio;
