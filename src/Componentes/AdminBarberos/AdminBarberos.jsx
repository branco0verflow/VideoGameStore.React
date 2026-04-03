import { useState, useEffect } from "react";
import VolverButton from "../VolverButton/VolverButton";

const AdministrarBarberos = () => {
  const [barberos, setBarberos] = useState([]);
  const [nuevoBarbero, setNuevoBarbero] = useState({ nombre: "", apellido: "", imagenUrl: "", contra: "", admin: false });
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);

  useEffect(() => { fetchBarberos(); }, []);

  const fetchBarberos = async () => {
    try {
      const r = await fetch("https://albo-barber.onrender.com/api/socios");
      setBarberos(await r.json());
    } catch (err) { console.error(err); }
  };

  const handleCrearBarbero = async () => {
    try {
      const r = await fetch("https://albo-barber.onrender.com/api/socios", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevoBarbero),
      });
      if (r.ok) { fetchBarberos(); setNuevoBarbero({ nombre: "", apellido: "", imagenUrl: "", contra: "", admin: false }); }
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async (id) => {
    try {
      const r = await fetch(`https://albo-barber.onrender.com/api/socios/${id}`, { method: "DELETE" });
      if (r.ok) fetchBarberos();
    } catch (err) { console.error(err); }
  };

  const handleModificar = async () => {
    if (!barberoSeleccionado) return;
    try {
      const r = await fetch(`https://albo-barber.onrender.com/api/socios/${barberoSeleccionado.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(barberoSeleccionado),
      });
      if (r.ok) { fetchBarberos(); setBarberoSeleccionado(null); }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (barberoSeleccionado) setBarberoSeleccionado((p) => ({ ...p, [name]: val }));
    else setNuevoBarbero((p) => ({ ...p, [name]: val }));
  };

  const val = (field) => barberoSeleccionado ? barberoSeleccionado[field] : nuevoBarbero[field];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <VolverButton fallback="/adminReservas" />
        <h1 className="font-oswald font-semibold text-2xl text-white tracking-widest uppercase">
          Barberos
        </h1>
        <button onClick={handleCrearBarbero} className="btn-primary text-xs px-5 py-2.5 w-auto rounded-xl">
          {barberoSeleccionado ? "Nuevo" : "Crear"}
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 mb-8">
        <p className="font-oswald text-xs text-white/40 tracking-widest uppercase mb-4">
          {barberoSeleccionado ? "Modificar Barbero" : "Nuevo Barbero"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {[["nombre","Nombre"],["apellido","Apellido"],["imagenUrl","URL de imagen"],["contra","Contraseña"]].map(([name, placeholder]) => (
            <input key={name} type={name === "contra" ? "password" : "text"}
              name={name} placeholder={placeholder} value={val(name)} onChange={handleChange}
              aria-label={placeholder} className="input-field" />
          ))}
        </div>
        <label className="flex items-center gap-2 text-white/50 font-lato text-sm cursor-pointer mb-4">
          <input type="checkbox" name="admin"
            checked={barberoSeleccionado ? barberoSeleccionado.admin : nuevoBarbero.admin}
            onChange={handleChange} className="w-4 h-4 accent-white" />
          Es administrador
        </label>
        {barberoSeleccionado && (
          <div className="flex gap-2">
            <button onClick={handleModificar} className="btn-primary flex-1 py-2.5 text-xs">Guardar cambios</button>
            <button onClick={() => setBarberoSeleccionado(null)} className="btn-secondary flex-1 py-2.5 text-xs">Cancelar</button>
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {barberos.map((b) => (
          <div key={b.id}
            className={`bg-[#141414] border ${barberoSeleccionado?.id === b.id ? "border-white/40" : "border-white/[0.05]"} hover:border-white/20 transition-all overflow-hidden rounded-xl`}>
            <img src={b.imagenUrl} alt={b.nombre} className="w-full h-28 object-cover" />
            <div className="p-3">
              <p className="font-oswald text-white text-sm font-medium uppercase tracking-wide truncate mb-2">
                {b.nombre} {b.apellido}
              </p>
              <button onClick={() => setBarberoSeleccionado(b)}
                className="w-full font-oswald text-[10px] tracking-widest uppercase py-2 border border-white/10 text-white/60 hover:bg-white hover:text-black transition-all mb-1.5 rounded-lg">
                Modificar
              </button>
              <button onClick={() => handleEliminar(b.id)}
                className="w-full font-oswald text-[10px] tracking-widest uppercase py-2 border border-red-800/40 text-red-400 hover:bg-red-800 hover:text-white transition-all rounded-lg">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default AdministrarBarberos;
