import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../UsuarioContext/UsuarioContext"
import '../MisReservas/MissReservas.css';
import VolverButton from "../VolverButton/VolverButton";
import Cargando from "../Cargando/Cargando";

const MisReservas = () => {
    const { usuario } = useUsuario(); // Obtener el usuario desde el contexto
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
                return; // Salir si el usuario no está disponible
            }

            try {
                const response = await fetch(`https://albo-barber.onrender.com/reservas/usuario/${usuario.id}`);

                if (response.status === 204) {
                    // Si es 204 No Content, no hay reservas
                    setReservas([]);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    const errorText = await response.text(); // Obtener el texto de la respuesta
                    throw new Error(`Error al obtener las reservas: ${response.status} ${errorText}`);
                }

                const data = await response.json();
                setReservas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerReservas();
    }, [usuario]);

    const cancelarReserva = async (reservaId) => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/reservas/${reservaId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Error al cancelar la reserva");
            }
            // Actualizar la lista de reservas eliminando la reserva cancelada
            setReservas((prevReservas) =>
                prevReservas.filter((reserva) => reserva.id !== reservaId)
            );
            alert("Reserva cancelada con éxito");
        } catch (err) {
            alert(`Error al cancelar la reserva: ${err.message}`);
        }
    };

    // Manejo de estados de carga y error
    if (loading) return <Cargando />;
    if (error) return <p>Error: {error}</p>;

    // Verificar si no hay reservas
    const sinReservas = reservas.length === 0;

    return (
        <div className="mis-reservas">
            <div className="volver-atras-reservas">
            <VolverButton fallback='/reservar'/>
            </div>
            <h2 className="bungee-inline-regular">Hola {usuario.nombre}, estas son tus reservas:</h2>
            
            {sinReservas ? (
                <p className="bungee-inline-regular">Aún no tienes reservas registradas.</p>
            ) : (
                <ul className="reservas-list">
                    {reservas.map((reserva) => (
                        <li key={reserva.id} className="reserva-item">
                            <div className="reserva-detalle">
                                <p className="sulphur-point-bold">
                                    <strong>Barbero:</strong> {reserva.socio.nombre} {reserva.socio.apellido}
                                </p>
                                <p className="sulphur-point-bold">
                                    <strong>Fecha:</strong> {reserva.fechaSeleccionada}
                                </p>
                                <p className="sulphur-point-bold">
                                    <strong>Hora:</strong> {reserva.horarioSeleccionado}
                                </p>
                                <p className="sulphur-point-bold">
                                    <strong>Estado:</strong>{" "}
                                    {reserva.estado ? "Confirmada" : "Pendiente"}
                                </p>
                                <p className="sulphur-point-bold">
                                    <strong>Precio:</strong> {reserva.tipoDeCorte.precio}
                                </p>
                            </div>
                            {!reserva.estado && (
                                <button
                                    onClick={() => cancelarReserva(reserva.id)}
                                    className="cancelar-btn"
                                >
                                    Cancelar Reserva
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MisReservas;
