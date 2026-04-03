import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import imgLogo from "../../Images/logo.png";

const AdminReservas = () => {
  const { socio, setSocio } = useSocio();
  const navigate = useNavigate();

  const handleLogout = () => {
    setSocio(null);
    navigate("/socioLogin");
  };

  const NavBtn = ({ label, to }) => (
    <button
      onClick={() => navigate(to)}
      className="w-full bg-[#141414] border border-white/[0.07] text-white font-oswald font-medium
                 text-base tracking-widest uppercase py-4 px-6
                 hover:border-white/20 hover:bg-[#1a1a1a]
                 active:scale-[0.98] transition-all duration-200
                 rounded-xl text-left flex items-center justify-between group"
    >
      {label}
      <span className="text-white/20 group-hover:text-white/60 transition-colors text-sm">→</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-10">
      <img src={imgLogo} alt="Albo Barbería" className="w-12 mb-8 opacity-80" />

      <h1 className="font-oswald font-semibold text-3xl sm:text-4xl text-white tracking-widest uppercase mb-1">
        Administración
      </h1>
      <div className="flex items-center gap-3 mb-10">
        <span className="h-px w-12 bg-white/10" />
        <span className="font-lato text-xs text-white/40 tracking-widest uppercase">
          {socio?.nombre || "Barbero"}
        </span>
        <span className="h-px w-12 bg-white/10" />
      </div>

      <div className="w-full max-w-xs space-y-2">
        <NavBtn label="Ver Reservas" to="/VerReservas" />
        <NavBtn label="Crear Usuario" to="/registrarse" />
        {socio?.admin && (
          <>
            <NavBtn label="Administrar Barberos" to="/adminBarberos" />
            <NavBtn label="Contaduría" to="/cierresEntreFechas" />
            <NavBtn label="Administrar Cortes" to="/adminCortes" />
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 btn-destructive max-w-xs"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default AdminReservas;
