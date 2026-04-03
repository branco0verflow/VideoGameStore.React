import { useEffect, useState } from 'react';
import { useUsuario } from '../UsuarioContext/UsuarioContext';
import imagenPerfil from '../../Images/perfil.png';
import { useNavigate } from 'react-router-dom';
import VolverButton from "../VolverButton/VolverButton";
import Cargando from '../Cargando/Cargando';

const PerfilUsuario = () => {
    const { usuario } = useUsuario();
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            if (!usuario || !usuario.id) {
                setError("Usuario no encontrado.");
                setLoading(false);
                alert("Debes iniciar sesión.");
                navigate('/');
                return;
            }
            try {
                const r = await fetch(`https://albo-barber.onrender.com/usuarios/${usuario.id}`);
                if (!r.ok) throw new Error("Error al obtener los datos.");
                setDatosUsuario(await r.json());
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        obtenerDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const actualizarUsuario = async () => {
        if (!datosUsuario) return;
        try {
            const r = await fetch(`https://albo-barber.onrender.com/usuarios/${usuario.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosUsuario),
            });
            if (!r.ok) throw new Error("Error al actualizar.");
            await r.json();
            setMensaje("Usuario actualizado con éxito.");
        } catch (err) { setMensaje(`Error: ${err.message}`); }
    };

    if (loading) return <Cargando />;
    if (error) return <p className="font-lato text-red-300 text-center mt-8">Error: {error}</p>;

    const Field = ({ label, type = "text", value, onChange }) => (
        <div>
            <label className="field-label">{label}</label>
            <input type={type} value={value} onChange={onChange} className="input-field" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm">
                {/* Back */}
                <div className="mb-6">
                    <VolverButton fallback='/reservar' />
                </div>

                {/* Avatar */}
                <div className="text-center mb-6">
                    <img src={imagenPerfil} alt="Foto de perfil"
                        className="w-20 h-20 object-cover rounded-full mx-auto grayscale brightness-90 border border-white/10" />
                    <h1 className="font-oswald font-semibold text-2xl text-white tracking-widest uppercase mt-4">
                        {datosUsuario.nombre} {datosUsuario.apellido}
                    </h1>
                    <p className="font-lato text-white/40 text-sm">@{datosUsuario.nombreUsuario}</p>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">Editar Perfil</span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {/* Formulario */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                    <Field label="Nombre" value={datosUsuario.nombre}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, nombre: e.target.value })} />
                    <Field label="Apellido" value={datosUsuario.apellido}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, apellido: e.target.value })} />
                    <Field label="Nombre de usuario" value={datosUsuario.nombreUsuario}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, nombreUsuario: e.target.value })} />
                    <Field label="Teléfono" type="tel" value={datosUsuario.telefono}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, telefono: e.target.value })} />

                    {mensaje && (
                        <p className={`font-lato text-xs text-center px-3 py-2 rounded-xl border ${
                            mensaje.includes("Error")
                                ? "text-red-300 border-red-800/50 bg-red-950/40"
                                : "text-green-300 border-green-800/50 bg-green-950/40"
                        }`}>
                            {mensaje}
                        </p>
                    )}

                    <button onClick={actualizarUsuario} className="btn-primary">
                        Actualizar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
