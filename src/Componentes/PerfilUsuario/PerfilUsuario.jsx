import React, { useEffect, useState } from 'react';
import { useUsuario } from '../UsuarioContext/UsuarioContext'; // Importar el contexto del usuario
import './PerfilUsuario.css'; // Archivo CSS para estilos
import imagenPerfil from '../../Images/perfil.png';
import { useNavigate } from 'react-router-dom'; // Hook para navegación

const PerfilUsuario = () => {
    const { usuario } = useUsuario(); // Obtener el usuario desde el contexto
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(""); // Mensaje de éxito/error
    const navigate = useNavigate(); // Para manejar navegación

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            if (!usuario || !usuario.id) {
                setError("Usuario no encontrado.");
                setLoading(false);
                alert("Debes iniciar sesión para continuar.");
                navigate('/');
                return;
            }

            try {
                const response = await fetch(`https://albo-barber.onrender.com/usuarios/${usuario.id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario.");
                }
                const data = await response.json();
                setDatosUsuario(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerDatosUsuario();
    }, [usuario]);

    const actualizarUsuario = async () => {
        if (!datosUsuario) return;

        try {
            const response = await fetch(`https://albo-barber.onrender.com/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar los datos del usuario.");
            }

            const data = await response.json();
            setMensaje("Usuario actualizado con éxito.");
        } catch (err) {
            setMensaje(`Error: ${err.message}`);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="perfil-usuario">
            {/* Botón Volver */}
            <button className="boton-volver" onClick={() => navigate(-1)}>
                Volver atrás
            </button>

            <div className="imagen-container">
                <img
                    src={imagenPerfil}
                    alt="Foto de perfil"
                    className="imagen-perfil"
                />
            </div>

            <div className="datos-usuario">
                <label>
                    <strong>Nombre:</strong>
                    <input
                        type="text"
                        value={datosUsuario.nombre}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, nombre: e.target.value })}
                    />
                </label>
                <label>
                    <strong>Apellido:</strong>
                    <input
                        type="text"
                        value={datosUsuario.apellido}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, apellido: e.target.value })}
                    />
                </label>
                <label>
                    <strong>Nombre de usuario:</strong>
                    <input
                        type="text"
                        value={datosUsuario.nombreUsuario}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, nombreUsuario: e.target.value })}
                    />
                </label>
                <label>
                    <strong>Teléfono:</strong>
                    <input
                        type="tel"
                        value={datosUsuario.telefono}
                        onChange={(e) => setDatosUsuario({ ...datosUsuario, telefono: e.target.value })}
                    />
                </label>
            </div>

            {/* Mensaje de éxito/error */}
            {mensaje && <p className="mensaje">{mensaje}</p>}

            {/* Botón Actualizar Usuario */}
            <button className="boton-actualizar" onClick={actualizarUsuario}>
                Actualizar usuario
            </button>
        </div>
    );
};

export default PerfilUsuario;
