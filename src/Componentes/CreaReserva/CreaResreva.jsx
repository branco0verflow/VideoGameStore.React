import { useState, useEffect } from "react";
import { useUsuario } from "../UsuarioContext/UsuarioContext";
import { useNavigate } from "react-router-dom";
import imgLogo from '../../Images/logo.png';
import imgBrander from '../../Images/brander.png';
import Cargando from "../Cargando/Cargando";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaCalendarAlt, FaClock, FaCut } from "react-icons/fa";

const FormularioReserva = () => {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [paso, setPaso] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [tipoDeCorte, setTipoDeCorte] = useState([]);
  const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (socios.length > 0) setSocioSeleccionado(socios[0].id); }, [socios]);
  useEffect(() => { fetch("https://albo-barber.onrender.com/tipos-de-corte").then(r=>r.json()).then(setTipoDeCorte).catch(()=>setError("Error al cargar tipos de corte")); }, []);
  useEffect(() => { fetch("https://albo-barber.onrender.com/api/socios").then(r=>r.json()).then(setSocios).catch(()=>{setError("Error al cargar socios");setLoading(false);}); }, []);

  useEffect(() => {
    if (!socioSeleccionado || !fechaSeleccionada) return;
    setLoadingHorarios(true);
    setHorarios([]);
    const [anio, mes, dia] = fechaSeleccionada.split("-");
    fetch(`https://albo-barber.onrender.com/reservas/horarios-disponibles/${socioSeleccionado}?anio=${anio}&mes=${mes}&dia=${dia}`)
      .then(r=>r.json()).then(setHorarios).catch(()=>setError("Error al cargar horarios"))
      .finally(()=>setLoadingHorarios(false));
  }, [socioSeleccionado, fechaSeleccionada]);

  useEffect(() => { window.scrollTo(0, 0); }, [paso]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!socioSeleccionado || !fechaSeleccionada || !horarioSeleccionado) { setError("Complete todos los campos"); return; }
    if (!usuario) { alert("Debe iniciar sesión"); return; }
    try {
      const r = await fetch("https://albo-barber.onrender.com/reservas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaSeleccionada, horarioSeleccionado, tipoDeCorte: { id: tipoDeCorteSeleccionado }, usuario, estado: false, noMonetario: false, cortesia: { id: 1 }, socio: { id: socioSeleccionado } }),
      });
      if (r.ok) {
        setConfirmado(true);
        setTimeout(() => navigate("/reservasCreadas", { state: { scrollToBottom: true } }), 1500);
      }
      else setError("Error al confirmar la reserva");
    } catch { setError("Error al enviar la solicitud"); }
  };

  /* ── Paso ── */
  const Step = ({ n }) => (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-oswald text-xs transition-all
      ${paso === n ? "bg-white text-black" : paso > n ? "bg-white/20 text-white/60" : "bg-white/[0.06] text-white/20"}`}>
      {n}
    </div>
  );

  /* ── Nav inferior ── */
  const BottomNav = () => (
    <div className="flex gap-2 pt-4 mt-4 border-t border-white/[0.05]">
      {[["Mis Reservas", "/reservasCreadas"], ["Perfil", "/miPerfil"], ["Salir", "/"]].map(([lbl, to]) => (
        <button key={to} type="button" onClick={() => navigate(to)}
          className="flex-1 font-oswald text-[10px] tracking-widest uppercase text-white/30 py-2.5 rounded-xl border border-white/[0.05] hover:bg-white/[0.03] hover:text-white/60 transition-all">
          {lbl}
        </button>
      ))}
    </div>
  );

  if (confirmado) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-900/40 border border-green-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-oswald text-white text-2xl tracking-widest uppercase">Listo</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Formulario centrado */}
      <div className="w-full bg-[#0a0a0a] flex items-start justify-center px-5 py-8 overflow-y-auto">
        <div className="w-full max-w-[400px]">

          {/* Logo + pasos */}
          <div className="flex items-center justify-between mb-8">
            <img src={imgLogo} alt="Albo Barbería" className="w-10 opacity-80" />
            <div className="flex items-center gap-2">
              <Step n={1} /> <span className="w-5 h-px bg-white/10" /> <Step n={2} /> <span className="w-5 h-px bg-white/10" /> <Step n={3} />
            </div>
          </div>

          {loading && <Cargando />}

          {error && (
            <div className="bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="font-lato text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* ── PASO 1: Barbero + Fecha ── */}
          {paso === 1 && (
            <div>
              <h2 className="font-oswald font-semibold text-2xl text-white mb-1">Reservar turno</h2>
              <p className="font-lato text-white/40 text-sm mb-6">Selecciona barbero y fecha</p>

              {/* Cards barberos */}
              <div className="mb-6">
                <label className="field-label">Barbero</label>
                <div className="flex flex-wrap gap-3">
                  {socios.map((s) => (
                    <div key={s.id} onClick={() => setSocioSeleccionado(s.id)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 w-[120px]
                        ${socioSeleccionado === s.id ? "ring-2 ring-white" : "ring-1 ring-white/[0.07] hover:ring-white/20"}`}>
                      <img src={s.imagenUrl} alt={s.nombre} className="w-full h-28 object-cover"
                        onLoad={() => setLoading(false)} />
                      <div className={`px-2 py-1.5 text-center ${socioSeleccionado === s.id ? "bg-white" : "bg-[#1c1c1c]"}`}>
                        <p className={`font-marker text-[11px] truncate ${socioSeleccionado === s.id ? "text-black" : "text-white/70"}`}>
                          {s.nombre}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div className="mb-8">
                <label className="field-label">Fecha</label>
                <div className="relative w-full sm:w-56">
                  <DatePicker
                    selected={fechaSeleccionada ? new Date(`${fechaSeleccionada}T00:00:00`) : null}
                    onChange={(date) => {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      setFechaSeleccionada(`${yyyy}-${mm}-${dd}`);
                    }}
                    dateFormat="yyyy-MM-dd" minDate={new Date()}
                    filterDate={(d) => d.getDay() !== 0 && d.getDay() !== 1}
                    placeholderText="Selecciona una fecha"
                  />
                  <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-sm" />
                </div>
              </div>

              <button type="button" onClick={() => setPaso(2)} disabled={!socioSeleccionado || !fechaSeleccionada}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                Continuar
              </button>
              <BottomNav />
            </div>
          )}

          {/* ── PASO 2: Horario + Corte ── */}
          {paso === 2 && (
            <div>
              <h2 className="font-oswald font-semibold text-2xl text-white mb-1">Detalles</h2>
              <p className="font-lato text-white/40 text-sm mb-6">Horario y tipo de corte</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="field-label" htmlFor="horario">Horario disponible</label>
                  <select id="horario" className="input-field cursor-pointer" value={horarioSeleccionado}
                    onChange={(e) => setHorarioSeleccionado(e.target.value)} disabled={loadingHorarios || !horarios.length}>
                    <option value="">
                      {loadingHorarios ? "Cargando horarios..." : horarios.length === 0 ? "Sin horarios disponibles" : "Selecciona un horario"}
                    </option>
                    {horarios.map((h, i) => <option key={i} value={h}>{h.split(":").slice(0,2).join(":")}</option>)}
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="corte">Tipo de corte</label>
                  <select id="corte" className="input-field cursor-pointer" value={tipoDeCorteSeleccionado || ""}
                    onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)} required>
                    <option value="">Selecciona un tipo de corte</option>
                    {tipoDeCorte.map((t) => <option key={t.id} value={t.id}>{t.nombre} — ${t.precio}</option>)}
                  </select>
                </div>

                
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setPaso(1)} className="btn-secondary">Atrás</button>
                <button type="button" onClick={() => setPaso(3)} disabled={!horarioSeleccionado || !tipoDeCorteSeleccionado}
                  className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">Continuar</button>
              </div>
              <BottomNav />
            </div>
          )}

          {/* ── PASO 3: Confirmación ── */}
          {paso === 3 && (
            <div>
              <h2 className="font-oswald font-semibold text-2xl text-white mb-1">Confirmar</h2>
              <p className="font-lato text-white/40 text-sm mb-6">Revisa los datos de tu reserva</p>

              <div className="bg-[#141414] rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
                {[
                  { icon: <FaUser />, label: "Barbero", value: socios.find(s => s.id === socioSeleccionado)?.nombre || "—" },
                  { icon: <FaCalendarAlt />, label: "Fecha", value: fechaSeleccionada || "—" },
                  { icon: <FaClock />, label: "Horario", value: horarioSeleccionado ? horarioSeleccionado.split(":").slice(0,2).join(":") : "—" },
                  { icon: <FaCut />, label: "Corte", value: tipoDeCorte.find(t => String(t.id) === String(tipoDeCorteSeleccionado))?.nombre || "—" },
                ].map(({ icon, label, value }, i, arr) => (
                  <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                    <span className="text-white/25 text-sm">{icon}</span>
                    <div>
                      <p className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">{label}</p>
                      <p className="font-lato text-white text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setPaso(2)} className="btn-secondary">Atrás</button>
                <button type="submit" onClick={handleSubmit} className="btn-primary">Confirmar reserva</button>
              </div>
              <BottomNav />
            </div>
          )}

          {/* Footer brander */}
          <div className="mt-12 pt-6 border-t border-white/[0.04]">
            <a href="https://www.brandercloud.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 no-underline">
              <span className="font-lato text-white text-[10px] tracking-widest uppercase">Creado por</span>
              <img src={imgBrander} alt="Brander" className="h-12 w-auto" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FormularioReserva;
