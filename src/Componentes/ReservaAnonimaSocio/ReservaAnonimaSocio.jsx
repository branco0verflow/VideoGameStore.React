import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import VolverButton from "../VolverButton/VolverButton";

const CreaReservaAnonima = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDate, hora } = location.state || {};
    const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [telefonoCliente, setTelefonoCliente] = useState("");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
    const [usarDatosManual, setUsarDatosManual] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [tiposDeCorte, setTiposDeCorte] = useState([]);
    const [error, setError] = useState("");
    const { socio } = useSocio();

    useEffect(() => {
        Promise.all([
            fetch("https://albo-barber.onrender.com/tipos-de-corte").then((r) => r.json()),
            fetch("https://albo-barber.onrender.com/usuarios").then((r) => r.json()),
        ]).then(([tipos, users]) => { setTiposDeCorte(tipos); setUsuarios(users); })
          .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !hora) { setError("Falta la fecha u hora."); return; }
        if (!tipoDeCorteSeleccionado) { setError("Seleccione un tipo de corte."); return; }

        let reserva;
        if (!usarDatosManual) {
            if (!nombreCliente) { setError("Ingrese un nombre."); return; }
            reserva = { fechaSeleccionada: selectedDate, horarioSeleccionado: hora, tipoDeCorte: { id: tipoDeCorteSeleccionado }, nombreCliente, telefonoCliente: telefonoCliente || null, estado: false, noMonetario: false, cortesia: { id: 1 }, socio: { id: socio.id } };
        } else {
            if (!usuarioSeleccionado) { setError("Seleccione un usuario."); return; }
            reserva = { fechaSeleccionada: selectedDate, horarioSeleccionado: hora, tipoDeCorte: { id: tipoDeCorteSeleccionado }, usuario: { id: Number(usuarioSeleccionado) }, estado: false, noMonetario: false, cortesia: { id: 1 }, socio: { id: socio.id } };
        }

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
                    <VolverButton fallback="/VerReservas" />
                    <div>
                        <h1 className="font-oswald font-semibold text-xl text-white tracking-widest uppercase">
                            Nueva Reserva
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
                    {!usarDatosManual ? (
                        <>
                            <div>
                                <label htmlFor="nombre-cliente" className="field-label">Nombre del Cliente</label>
                                <input id="nombre-cliente" type="text" value={nombreCliente}
                                    onChange={(e) => setNombreCliente(e.target.value)}
                                    required className="input-field" />
                            </div>
                            <div>
                                <label htmlFor="telefono-cliente" className="field-label">Teléfono (opcional)</label>
                                <input id="telefono-cliente" type="text" value={telefonoCliente}
                                    onChange={(e) => setTelefonoCliente(e.target.value)}
                                    className="input-field" />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label htmlFor="usuario-select" className="field-label">Usuario registrado</label>
                            <select id="usuario-select" className="input-field cursor-pointer" value={usuarioSeleccionado}
                                onChange={(e) => setUsuarioSeleccionado(Number(e.target.value))} required>
                                <option value="">Seleccione un usuario</option>
                                {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} ({u.nombreUsuario})</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="tipo-corte" className="field-label">Tipo de Corte</label>
                        <select id="tipo-corte" className="input-field cursor-pointer" value={tipoDeCorteSeleccionado}
                            onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)} required>
                            <option value="">Seleccione tipo de corte</option>
                            {tiposDeCorte.map((t) => <option key={t.id} value={t.id}>{t.nombre} — ${t.precio}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center justify-between bg-[#1c1c1c] border border-white/[0.06] px-4 py-3 rounded-xl">
                        <span className="font-lato text-white/50 text-sm">
                            ¿Datos automáticos?
                        </span>
                        <label className="switch" aria-label="Usar datos automáticos">
                            <input type="checkbox" aria-label="Usar datos automáticos" checked={usarDatosManual} onChange={(e) => setUsarDatosManual(e.target.checked)} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn-primary mt-6">
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

export default CreaReservaAnonima;
