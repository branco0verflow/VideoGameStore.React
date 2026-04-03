import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../UsuarioContext/UsuarioContext";
import VolverButton from "../VolverButton/VolverButton";
import Cargando from "../Cargando/Cargando";

const MisReservas = () => {
    const { usuario } = useUsuario();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerReservas = async () => {
            if (!usuario || !usuario.id) {
                setError("Usuario no encontrado");
                setLoading(false);
                alert("Debes iniciar sesión");
                navigate('/');
                return;
            }
            try {
                const response = await fetch(`https://albo-barber.onrender.com/reservas/usuario/${usuario.id}`);
                if (response.status === 204) { setReservas([]); setLoading(false); return; }
                if (!response.ok) throw new Error(`Error ${response.status}`);
                setReservas(await response.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        obtenerReservas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const cancelarReserva = async (reservaId) => {
        try {
            const r = await fetch(`https://albo-barber.onrender.com/reservas/${reservaId}`, { method: "DELETE" });
            if (!r.ok) throw new Error("Error al cancelar");
            setReservas((prev) => prev.filter((r) => r.id !== reservaId));
            alert("Reserva cancelada con éxito");
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    if (loading) return <Cargando />;
    if (error) return <p className="font-lato text-red-300 text-center mt-8">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-2">
                    <VolverButton fallback='/reservar' />
                    <div>
                        <h1 className="font-oswald font-semibold text-2xl text-white tracking-widest uppercase">
                            Mis Reservas
                        </h1>
                        <p className="font-lato text-white/40 text-sm">{usuario.nombre}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">
                        {reservas.length} reserva{reservas.length !== 1 ? "s" : ""}
                    </span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {reservas.length === 0 ? (
                    <div className="text-center py-16 border border-white/[0.04] bg-[#141414] rounded-2xl">
                        <p className="font-oswald text-white/20 text-lg tracking-widest uppercase">
                            Sin reservas registradas
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {reservas.map((reserva) => (
                            <li key={reserva.id}
                                className={`bg-[#141414] border-l-2 ${reserva.estado ? "border-l-green-600" : "border-l-white/20"} border-y border-r border-white/[0.05] rounded-r-xl`}>
                                <div className="p-4">
                                    {/* Header de reserva */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <p className="font-oswald font-semibold text-white text-base tracking-wide">
                                                {reserva.fechaSeleccionada}
                                                <span className="ml-2 text-white/60">
                                                    {reserva.horarioSeleccionado.split(":").slice(0, 2).join(":")}
                                                </span>
                                            </p>
                                            <p className="font-lato text-white/40 text-xs mt-0.5">
                                                {reserva.socio.nombre} {reserva.socio.apellido}
                                            </p>
                                        </div>
                                        <span className={`font-oswald text-[10px] tracking-widest uppercase px-2 py-1 rounded-lg border ${
                                            reserva.estado
                                                ? "text-green-400 border-green-700/50 bg-green-900/20"
                                                : "text-yellow-400 border-yellow-700/50 bg-yellow-900/20"
                                        }`}>
                                            {reserva.estado ? "Confirmada" : "Pendiente"}
                                        </span>
                                    </div>

                                    {/* Detalles */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-[#0f0f0f] px-3 py-2 rounded-lg">
                                            <p className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">Corte</p>
                                            <p className="font-lato text-white text-sm font-semibold">{reserva.tipoDeCorte?.nombre || "—"}</p>
                                        </div>
                                        <div className="bg-[#0f0f0f] px-3 py-2 rounded-lg">
                                            <p className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">Precio</p>
                                            <p className="font-oswald text-white font-semibold text-base">${reserva.tipoDeCorte?.precio}</p>
                                        </div>
                                    </div>

                                    {!reserva.estado && (
                                        <button onClick={() => cancelarReserva(reserva.id)}
                                            className="btn-destructive w-full py-2.5 text-xs">
                                            Cancelar Reserva
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MisReservas;
