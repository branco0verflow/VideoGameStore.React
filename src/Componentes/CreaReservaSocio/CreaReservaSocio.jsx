import { useState, useEffect } from "react";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import VolverButton from "../VolverButton/VolverButton";
import { useNavigate, useLocation } from "react-router-dom";

const CreaReservaSocio = () => {
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const location = useLocation();
    const { selectedDate, hora } = location.state || {};
    const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState("");
    const [cortesiaSeleccionada, setCortesiaSeleccionada] = useState("");
    const [tiposDeCorte, setTiposDeCorte] = useState([]);
    const [cortesias, setCortesias] = useState([]);
    const [error, setError] = useState("");
    const [cortesiaActiva, setCortesiaActiva] = useState(false);
    const { socio } = useSocio();

    useEffect(() => {
        fetch("https://albo-barber.onrender.com/tipos-de-corte").then((r) => r.json()).then(setTiposDeCorte).catch(console.error);
    }, []);
    useEffect(() => {
        fetch("https://albo-barber.onrender.com/api/cortesias").then((r) => r.json()).then(setCortesias).catch(console.error);
    }, []);

    const buscarUsuario = async () => {
        try {
            const r = await fetch(`https://albo-barber.onrender.com/usuarios/buscarPorNombre/${nombreUsuario}`);
            const data = await r.json();
            if (r.ok) { setUsuarios(data); setUsuarioSeleccionado(null); }
            else { alert("Usuario no encontrado"); setUsuarios([]); }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usuarioSeleccionado || !socio || !tipoDeCorteSeleccionado) { setError("Complete todos los campos"); return; }
        const reserva = {
            fechaSeleccionada: selectedDate, horarioSeleccionado: hora,
            tipoDeCorte: { id: tipoDeCorteSeleccionado },
            usuario: { id: usuarioSeleccionado.id },
            estado: false, noMonetario: false,
            cortesia: { id: cortesiaActiva ? cortesiaSeleccionada : 1 },
            socio: { id: socio.id }
        };
        try {
            const r = await fetch("https://albo-barber.onrender.com/reservas", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reserva),
            });
            if (r.ok) { alert("Reserva confirmada"); navigate(-1); }
            else setError("Error al confirmar la reserva");
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#141414] border border-white/[0.06] rounded-2xl p-6 sm:p-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <VolverButton fallback="/reservaAnonima" />
                    <div>
                        <h1 className="font-oswald font-semibold text-xl text-white tracking-widest uppercase">
                            Crear Reserva
                        </h1>
                        <p className="font-lato text-white/40 text-xs mt-0.5">{selectedDate} · {hora}</p>
                    </div>
                </div>

                {error && (
                    <p className="font-lato text-red-300 text-xs bg-red-950/60 border border-red-800/40 px-3 py-2 mb-4 rounded-xl">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    {/* Buscar usuario */}
                    <div>
                        <label htmlFor="buscar-nombre" className="field-label">Buscar por nombre</label>
                        <div className="flex gap-2">
                            <input id="buscar-nombre" type="text" value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                className="input-field flex-1" />
                            <button type="button" onClick={buscarUsuario}
                                className="font-oswald tracking-widest uppercase text-xs px-4 border border-white/10 text-white/60 hover:bg-white hover:text-black transition-all whitespace-nowrap rounded-xl">
                                Buscar
                            </button>
                        </div>
                    </div>

                    {usuarios.length > 0 && (
                        <div>
                            <label htmlFor="select-usuario" className="field-label">Usuarios encontrados</label>
                            <select id="select-usuario" className="input-field cursor-pointer"
                                value={usuarioSeleccionado ? usuarioSeleccionado.id : ""}
                                onChange={(e) => setUsuarioSeleccionado(usuarios.find((u) => u.id === parseInt(e.target.value)))}>
                                <option value="" disabled>Seleccione un usuario</option>
                                {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
                            </select>
                        </div>
                    )}

                    {usuarioSeleccionado && (
                        <p className="font-lato text-white/60 text-xs bg-white/[0.05] border border-white/10 px-3 py-2 rounded-xl">
                            Seleccionado: <span className="font-semibold text-white">{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</span>
                        </p>
                    )}

                    <div>
                        <label htmlFor="tipo-corte-socio" className="field-label">Tipo de Corte</label>
                        <select id="tipo-corte-socio" className="input-field cursor-pointer" value={tipoDeCorteSeleccionado}
                            onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)}>
                            <option value="">Seleccione tipo de corte</option>
                            {tiposDeCorte.map((t) => <option key={t.id} value={t.id}>{t.nombre} — ${t.precio}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="cortesia-select" className="field-label">Cortesía</label>
                        <select id="cortesia-select" className="input-field cursor-pointer" value={cortesiaSeleccionada}
                            onChange={(e) => { setCortesiaSeleccionada(e.target.value); setCortesiaActiva(e.target.value !== ""); }}>
                            {cortesias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <button type="button" onClick={handleSubmit} className="btn-primary mt-6">
                    Confirmar Reserva
                </button>

                <div className="flex gap-3 mt-3">
                    <button type="button"
                        className="flex-1 font-oswald tracking-widest uppercase text-xs py-3 bg-[#1c1c1c] border border-white/10 text-white/50 hover:bg-white hover:text-black transition-all rounded-xl"
                        onClick={() => navigate("/crearReserva", { state: { selectedDate, hora } })}>
                        Anónimo
                    </button>
                    <button type="button"
                        className="flex-1 font-oswald tracking-widest uppercase text-xs py-3 bg-[#1c1c1c] border border-white/10 text-white/50 hover:bg-white hover:text-black transition-all rounded-xl"
                        onClick={() => navigate("/registrarse")}>
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreaReservaSocio;
