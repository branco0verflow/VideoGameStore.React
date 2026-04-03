import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../Componentes/UsuarioContext/UsuarioContext";

const FormularioRegistro = () => {
    const { setUsuario } = useUsuario();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "", nombreUsuario: "", apellido: "",
        email: "bar@ber.com", telefono: "", contra: "",
    });
    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const r = await fetch("https://albo-barber.onrender.com/usuarios", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
            });
            if (r.ok) {
                setMensaje("¡Usuario registrado con éxito!");
                const usuario = await r.json();
                setUsuario(usuario);
                navigate("/reservar");
                setFormData({ nombre: "", nombreUsuario: "", apellido: "", email: "", telefono: "", contra: "" });
            } else setMensaje("Error al registrar el usuario.");
        } catch { setMensaje("Ocurrió un error. Intenta de nuevo."); }
    };

    const fields = [
        { label: "Nombre", name: "nombre", type: "text" },
        { label: "Nombre de Usuario", name: "nombreUsuario", type: "text" },
        { label: "Apellido", name: "apellido", type: "text" },
        { label: "Teléfono", name: "telefono", type: "tel" },
        { label: "Contraseña", name: "contra", type: "password" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-[380px]">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="font-oswald text-xs text-white/40 tracking-widest uppercase hover:text-white transition-colors mb-6"
                >
                    ← Volver
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-oswald font-semibold text-3xl text-white tracking-widest uppercase">
                        Crear Cuenta
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-px w-16 bg-white/10" />
                        <span className="font-lato text-xs text-white/40 tracking-widest uppercase">Albo Barbería</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                    {mensaje && (
                        <p className={`font-lato text-xs text-center px-3 py-2 rounded-xl border ${
                            mensaje.includes("Error") || mensaje.includes("error")
                                ? "text-red-300 border-red-800/50 bg-red-950/40"
                                : "text-green-300 border-green-800/50 bg-green-950/40"
                        }`}>
                            {mensaje}
                        </p>
                    )}

                    {fields.map(({ label, name, type }) => (
                        <div key={name}>
                            <label htmlFor={name} className="field-label">{label}</label>
                            <input
                                id={name} name={name} type={type}
                                value={formData[name]} onChange={handleChange} required
                                className="input-field"
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn-primary mt-2">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioRegistro;
