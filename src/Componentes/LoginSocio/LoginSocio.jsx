import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import imgLogo from '../../Images/logo.png';
import imgBrander from '../../Images/brander.png';
import video1 from '../../video/video1.mp4';
import { FaInstagram } from 'react-icons/fa';

const LoginSocio = () => {
  const { setSocio } = useSocio();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`https://albo-barber.onrender.com/api/socios/login/${username}/${password}`);
      if (!r.ok) { setError(r.status === 404 ? "Usuario o contraseña incorrectos" : "Error de conexión"); return; }
      setSocio(await r.json());
      navigate("/VerReservas");
    } catch { setError("Error al conectar con el servidor"); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — formulario */}
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

          {/* Brander */}
          <a href="https://www.brandercloud.com" target="_blank" rel="noopener noreferrer"
            className="mt-10 flex items-center justify-end gap-2 opacity-30 hover:opacity-60 transition-opacity">
            <span className="font-lato text-white text-[10px] tracking-widest uppercase">Creado por</span>
            <img src={imgBrander} alt="Brander" className="h-12 w-auto" />
          </a>
        </div>
      </div>

      {/* Panel derecho — video */}
      <div className="md:block md:w-1/2 relative">
        <video
          src={video1}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-[0.45]"
        />

        {/* Horarios e Instagram */}
        <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
          <div>
            <p className="font-oswald text-white/50 text-[11px] tracking-widest uppercase mb-1">Horarios</p>
            <p className="font-lato text-white/80 text-sm">Mar — Sáb</p>
            <p className="font-lato text-white/80 text-sm">10:00 — 20:00</p>
          </div>
          <a
            href="https://www.instagram.com/albobarberia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Instagram de Albo Barbería"
          >
            <FaInstagram size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginSocio;
