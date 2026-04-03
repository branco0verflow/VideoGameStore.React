import imgLogo from "../../Images/logo.png";

const Cargando = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">

      {/* Logo con pulso */}
      <div className="relative flex items-center justify-center">
        {/* Anillo exterior girando lento */}
        <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-spin" style={{ animationDuration: "3s" }} />
        {/* Anillo interior con gap */}
        <div className="absolute w-16 h-16 rounded-full border-t border-white/30 animate-spin" style={{ animationDuration: "1.2s" }} />
        {/* Logo centrado */}
        <img src={imgLogo} alt="Albo Barbería" className="w-10" />
      </div>

      {/* Texto animado */}
      <div className="flex flex-col items-center gap-1">
        <p className="font-oswald text-xs tracking-[0.3em] uppercase text-white animate-pulse mt-3">
          Cargando ...
        </p>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-white/20 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cargando;
