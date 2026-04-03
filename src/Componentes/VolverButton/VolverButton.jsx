import { useNavigate } from "react-router-dom";

const VolverButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();
  return (
    <button
      aria-label="Volver"
      onClick={() => navigate(fallback)}
      className="font-oswald text-xs tracking-widest uppercase px-3 py-2.5
                 bg-transparent text-white/40 border border-white/10 rounded-xl
                 hover:text-white hover:border-white/30
                 active:scale-95 transition-all duration-200"
    >
      ←
    </button>
  );
};

export default VolverButton;
