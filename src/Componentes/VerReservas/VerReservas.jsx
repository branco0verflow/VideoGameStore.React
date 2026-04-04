import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faClock, faUser, faMobile, faScissors, faCopy, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import VolverButton from "../VolverButton/VolverButton";
import Cargando from "../Cargando/Cargando";

const VerReservas = () => {
  const { socio } = useSocio();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [facturacion, setFacturacion] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [noMonetario, setNoMonetario] = useState(0);
  const [cierreCaja, setCierreCaja] = useState(0);
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: "", monto: "" });
  const [listaGastos, setListaGastos] = useState([]);
  const [error, setError] = useState("");
  const [horariosDisponibles, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservas = async (fecha) => {
    try {
      const r = await fetch(`https://albo-barber.onrender.com/reservas/por-socio-y-fecha?socioId=${socio.id}&fecha=${fecha}`);
      if (!r.ok) throw new Error();
      const data = r.status === 204 || r.headers.get("Content-Length") === "0" ? [] : await r.json();
      setReservas(data); setError("");
    } catch { setError("No se pudieron cargar las reservas."); }
  };

  useEffect(() => {
    if (!socio || !selectedDate) return;
    setLoading(true);
    const [anio, mes, dia] = selectedDate.split("-");
    fetch(`https://albo-barber.onrender.com/reservas/horarios-disponibles/${socio.id}?anio=${anio}&mes=${mes}&dia=${dia}`)
      .then((r) => r.json())
      .then((data) => { setHorarios([]); setHorarios(data.map((h) => h.replace(":00", ""))); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [socio, selectedDate]);

  const copiarHorarios = () => {
    if (!horariosDisponibles.length) { alert("No hay horarios para copiar."); return; }
    const hoy = new Date().toISOString().split("T")[0];
    const ahora = new Date().getHours() * 60 + new Date().getMinutes();
    const filtrados = horariosDisponibles.filter((h) => {
      const [hr, m] = h.split(":").map(Number);
      return selectedDate !== hoy || hr * 60 + m >= ahora;
    });
    if (!filtrados.length) { alert("No hay horarios disponibles para copiar."); return; }
    navigator.clipboard.writeText("Horarios disponibles: " + filtrados.join(", ")).catch(console.error);
  };

  const fetchCierreCaja = async (fecha) => {
    try {
      const r = await fetch(`https://albo-barber.onrender.com/gastos/cierre-caja?fecha=${fecha}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setFacturacion(d.facturacion); setGastos(d.gastos); setNoMonetario(d.noMonetario); setCierreCaja(d.cierreCaja);
    } catch { setError("Error al calcular el cierre de caja."); }
  };

  const agregarGasto = async () => {
    try {
      const r = await fetch("https://albo-barber.onrender.com/gastos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: selectedDate, descripcion: nuevoGasto.descripcion, monto: parseFloat(nuevoGasto.monto) }),
      });
      if (!r.ok) throw new Error();
      alert("Gasto agregado."); setNuevoGasto({ descripcion: "", monto: "" }); fetchCierreCaja(selectedDate);
    } catch { alert("Error al agregar el gasto."); }
  };

  const confirmarReserva = async (id) => {
    const r = await fetch(`https://albo-barber.onrender.com/reservas/${id}/confirmar`, { method: "PATCH" });
    if (r.ok) { alert("Reserva confirmada."); fetchReservas(selectedDate); fetchCierreCaja(selectedDate); }
    else alert("Error al confirmar.");
  };

  const confirmarNoMonetaria = async (id) => {
    const r = await fetch(`https://albo-barber.onrender.com/reservas/${id}/confirmarNoMonetario`, { method: "PATCH" });
    if (r.ok) { alert("Confirmada (no monetaria)."); fetchReservas(selectedDate); fetchCierreCaja(selectedDate); }
    else alert("Error al confirmar.");
  };

  const eliminarReserva = async (id) => {
    try {
      const r = await fetch(`https://albo-barber.onrender.com/reservas/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      setReservas((prev) => prev.filter((res) => res.id !== id));
      alert("Reserva eliminada.");
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  const fetchGastos = async (fecha) => {
    try {
      const r = await fetch(`https://albo-barber.onrender.com/gastos/por-fecha?fecha=${fecha}`);
      if (!r.ok) throw new Error();
      setListaGastos(await r.json());
    } catch { console.error("Error al cargar gastos."); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchReservas(selectedDate); fetchCierreCaja(selectedDate); fetchGastos(selectedDate); }, [selectedDate]);

  if (loading) return <Cargando />;

  const SectionTitle = ({ children }) => (
    <h3 className="font-oswald font-semibold text-sm tracking-widest uppercase text-white/40 mb-3 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/[0.06]" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/[0.06]" />
    </h3>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Navegación de fechas */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          className="font-oswald tracking-widest uppercase text-xs font-medium px-4 py-2.5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white transition-all duration-200 rounded-xl"
          onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}>
          Hoy
        </button>
        <button
          className="font-oswald tracking-widest uppercase text-xs font-medium px-4 py-2.5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white transition-all duration-200 rounded-xl"
          onClick={() => { const d = new Date(); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split("T")[0]); }}>
          Mañana
        </button>
        <input
          aria-label="Seleccionar fecha"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          onClick={(e) => e.target.showPicker()}
          className="bg-[#1c1c1c] border border-white/[0.08] text-white font-lato text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-white/30 cursor-pointer"
        />
        <VolverButton fallback="/adminReservas" />
      </div>

      {/* Fecha seleccionada */}
      <h2 className="font-oswald font-semibold text-2xl text-white tracking-widest uppercase mb-1">{selectedDate}</h2>
      {error && <p className="font-lato text-red-300 text-xs mb-3">{error}</p>}

      {/* Lista de reservas */}
      <div className="space-y-2 mb-6">
        {reservas.length === 0 ? (
          <p className="font-lato text-white/30 text-sm text-center py-8 border border-white/[0.04] rounded-xl bg-[#141414]">
            No hay reservas para esta fecha.
          </p>
        ) : reservas.map((reserva) => (
          <div key={reserva.id}
            className={`bg-[#141414] border-l-2 ${reserva.estado ? "border-l-green-600" : "border-l-white/20"} border-y border-r border-white/[0.05] rounded-r-xl shadow-card`}>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 flex-1 min-w-0">
                <p className="font-oswald text-white text-sm font-semibold">
                  <FontAwesomeIcon icon={faClock} className="text-white/40 mr-1.5 text-xs" />
                  {reserva.horarioSeleccionado.split(":").slice(0, 2).join(":")}
                  {reserva.estado && <span className="ml-1.5 text-xs text-green-400 font-lato font-normal">✓</span>}
                </p>
                <p className="font-lato text-white/80 text-xs truncate">
                  <FontAwesomeIcon icon={faUser} className="text-white/30 mr-1.5" />
                  {reserva.usuario ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}` : reserva.nombreCliente}
                </p>
                <p className="font-lato text-white/40 text-xs">
                  <FontAwesomeIcon icon={faMobile} className="mr-1.5" />
                  {reserva.usuario ? reserva.usuario.telefono : reserva.telefonoCliente || "—"}
                </p>
                <p className="font-lato text-white/70 text-xs truncate">
                  <FontAwesomeIcon icon={faScissors} className="text-white/30 mr-1.5" />
                  {reserva.tipoDeCorte.nombre}{" "}
                  <span className="text-white font-semibold">${reserva.tipoDeCorte.precio}</span>
                </p>
              </div>

              {!reserva.estado && (
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => confirmarReserva(reserva.id)}
                    className="w-9 h-9 bg-green-900/40 text-green-400 border border-green-700/50 hover:bg-green-700 hover:text-white transition-all text-sm flex items-center justify-center rounded-lg">
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button onClick={() => confirmarNoMonetaria(reserva.id)}
                    className="w-9 h-9 bg-yellow-900/40 text-yellow-400 border border-yellow-700/50 hover:bg-yellow-700 hover:text-white transition-all text-sm flex items-center justify-center rounded-lg">
                    <FontAwesomeIcon icon={faCreditCard} />
                  </button>
                  <button onClick={() => eliminarReserva(reserva.id)}
                    className="w-9 h-9 bg-red-900/40 text-red-400 border border-red-800/50 hover:bg-red-700 hover:text-white transition-all text-sm flex items-center justify-center rounded-lg">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Horarios disponibles */}
      <div className="mb-6">
        <SectionTitle>Horarios libres</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-3">
          {horariosDisponibles.map((hora, i) => (
            <button key={i} onClick={() => navigate('/reservaAnonima', { state: { selectedDate, hora } })}
              className="font-oswald text-xs font-medium tracking-widest uppercase px-3 py-2 bg-[#141414] border border-white/10 text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-200 rounded-lg">
              {hora.split(":").slice(0, 2).join(":")}
            </button>
          ))}
          {horariosDisponibles.length === 0 && (
            <p className="font-lato text-white/30 text-xs">No hay horarios disponibles.</p>
          )}
        </div>
        <button onClick={copiarHorarios} disabled={horariosDisponibles.length === 0}
          className="font-oswald text-xs tracking-widest uppercase px-4 py-2.5 bg-[#141414] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl">
          <FontAwesomeIcon icon={faCopy} className="mr-2" /> Copiar horarios
        </button>
      </div>

      {/* Cierre de Caja */}
      <div className="mb-6">
        <SectionTitle>Cierre de Caja</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Facturado", value: facturacion, color: "text-green-400" },
            { label: "No monetario", value: noMonetario, color: "text-yellow-400" },
            { label: "Gastos", value: gastos, color: "text-red-400" },
            { label: "Cierre", value: cierreCaja, color: "text-white" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#141414] border border-white/[0.05] p-3 rounded-xl">
              <p className="font-oswald text-[10px] text-white/40 tracking-widest uppercase">{label}</p>
              <p className={`font-oswald font-semibold text-xl ${color}`}>${value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#141414] border border-white/[0.05] p-4 rounded-xl">
          <p className="font-oswald text-xs text-white/40 tracking-widest uppercase mb-3">Agregar Gasto</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input aria-label="Descripción del gasto" type="text" placeholder="Descripción" value={nuevoGasto.descripcion}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
              className="input-field flex-1" />
            <input aria-label="Monto del gasto" type="number" placeholder="Monto" value={nuevoGasto.monto}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
              className="input-field w-full sm:w-28" />
            <button onClick={agregarGasto} className="btn-primary whitespace-nowrap sm:w-auto py-3">Agregar</button>
          </div>
        </div>
      </div>

      {/* Gastos del día */}
      <div>
        <SectionTitle>Gastos del día</SectionTitle>
        {listaGastos.length === 0 ? (
          <p className="font-lato text-white/30 text-xs">Sin gastos registrados.</p>
        ) : (
          <div className="space-y-1">
            {listaGastos.map((g) => (
              <div key={g.id} className="flex justify-between items-center bg-[#141414] border border-white/[0.04] px-4 py-2.5 rounded-xl">
                <span className="font-lato text-white/70 text-sm">{g.descripcion}</span>
                <span className="font-oswald text-red-400 font-semibold text-sm">${g.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default VerReservas;
