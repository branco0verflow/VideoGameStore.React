import React, { useState, useEffect } from "react";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import './CreaReservaSocio.css';
import VolverButton from "../VolverButton/VolverButton";
import { useNavigate, useLocation } from "react-router-dom";
import { faUserPlus, faGhost } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CreaReservaSocio = () => {
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [usuarios, setUsuarios] = useState([]); // Almacena la lista de usuarios encontrados
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const location = useLocation();
    const { selectedDate, hora } = location.state || {};
    const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState("");
    const [cortesiaSeleccionada, setCortesiaSeleccionada] = useState(""); // Valor por defecto
    const [horarios, setHorarios] = useState([]);
    const [tiposDeCorte, setTiposDeCorte] = useState([]);
    const [cortesias, setCortesias] = useState([]);
    const [error, setError] = useState("");
    const fechaSeleccionada = selectedDate; // Fecha seleccionada
    const horarioSeleccionado = hora; // Horario seleccionado
    const [cortesiaActiva, setCortesiaActiva] = useState(false);



    const { socio } = useSocio();

    // Fetch de tipos de corte
    useEffect(() => {
        const fetchTiposDeCorte = async () => {
            try {
                const response = await fetch("https://albo-barber.onrender.com/tipos-de-corte");
                const data = await response.json();
                setTiposDeCorte(data);
            } catch (err) {
                console.error("Error al cargar tipos de corte", err);
            }
        };

        fetchTiposDeCorte();
    }, []);

    // Fetch de cortesías
    useEffect(() => {
        const fetchCortesias = async () => {
            try {
                const response = await fetch("https://albo-barber.onrender.com/api/cortesias");
                const data = await response.json();
                setCortesias(data);
            } catch (err) {
                console.error("Error al cargar cortesías", err);
            }
        };

        fetchCortesias();
    }, []);

    // Fetch de horarios disponibles
    useEffect(() => {

        const fetchHorarios = async () => {
            if (socio && selectedDate) {
                try {
                    const [anio, mes, dia] = selectedDate.split("-");
                    const response = await fetch(
                        `https://albo-barber.onrender.com/reservas/horarios-disponibles/${socio.id}?anio=${anio}&mes=${mes}&dia=${dia}`
                    );
                    const data = await response.json();
                    setHorarios(data);
                } catch (err) {
                    console.error("Error al cargar los horarios disponibles", err);
                }
            }
        };

        fetchHorarios();
    }, [socio, selectedDate]);


    // Buscar usuario por nombre
    const buscarUsuario = async () => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/usuarios/buscarPorNombre/${nombreUsuario}`);
            const data = await response.json();
            if (response.ok) {
                setUsuarios(data); // Guarda todos los usuarios encontrados
                console.log(data[1].nombre);
                setUsuarioSeleccionado(null); // Limpia cualquier selección previa
            } else {
                alert("Usuario no encontrado");
                setUsuarios([]);
            }
        } catch (err) {
            console.error("Error al buscar usuario", err);
            console.log(selectedDate, hora);
        }
    };

    // Crear la reserva
    const handleSubmit = async (e) => {
        e.preventDefault();

        const reserva = {
            fechaSeleccionada,
            horarioSeleccionado,
            tipoDeCorte: { id: tipoDeCorteSeleccionado },
            usuario: { id: usuarioSeleccionado.id },
            estado: false,
            cortesia: { id: cortesiaActiva ? cortesiaSeleccionada : 1 },
            socio: { id: socio.id }
        };

        if (!usuarioSeleccionado || !socio || !tipoDeCorteSeleccionado) {
            setError("Por favor, complete todos los campos");
            return;
        }

        try {
            const response = await fetch("https://albo-barber.onrender.com/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reserva),
            });


            if (response.ok) {
                alert("Reserva confirmada");
                navigate(-1);
            } else {
                setError(`Error al confirmar la reserva`);
            }
        } catch (err) {
            console.error("Error al realizar la reserva", err);
        }
    };

    const handleBack = () => {
        navigate(-1);  // Esto hará que el usuario vuelva a la página anterior
      };

    return (
        <form>

            <div className="cabezal-botones">
                <div className="boton-atras">
                    <VolverButton fallback="/VerReservas" />
                </div>
                <div className="CrearUser">
                    <button className="CrearUser-button" onClick={() => navigate("/registrarse")}><FontAwesomeIcon icon={faUserPlus} /></button>
                </div>
                <div className="CrearUser">
                    <button className="CrearUser-button" onClick={() => navigate("/reservaAnonima", { state: { selectedDate, hora } }) }><FontAwesomeIcon icon={faGhost} /></button>
                </div>
            </div>


            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="nombreForm">
                <label>Nombre del Usuario:</label>
                <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                />
                <button type="button" onClick={buscarUsuario}>Buscar Usuario</button>
            </div>

            {usuarios.length > 0 && (
                <div>
                    <p>Usuarios encontrados:</p>
                    <select
                        value={usuarioSeleccionado ? usuarioSeleccionado.id : ""}
                        onChange={(e) =>
                            setUsuarioSeleccionado(
                                usuarios.find((u) => u.id === parseInt(e.target.value))
                            )
                        }
                    >
                        <option value="" disabled>
                            Seleccione un usuario
                        </option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} {usuario.apellido}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {usuarioSeleccionado && (
                <p>Usuario seleccionado: {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
            )}



            <div>
                <label>Tipo de Corte:</label>
                <select value={tipoDeCorteSeleccionado} onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)}>
                    <option value="">Seleccione un tipo de corte</option>
                    {tiposDeCorte.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre} - ${tipo.precio}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Cortesía:</label>
                <select value={cortesiaSeleccionada} onChange={(e) => {
                    setCortesiaSeleccionada(e.target.value);
                    setCortesiaActiva(e.target.value !== "");
                }}>
                    {cortesias.map((cortesia) => (
                        <option key={cortesia.id} value={cortesia.id}>{cortesia.nombre}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleSubmit}>Confirmar Reserva</button>
        </form>

    );
};

export default CreaReservaSocio;
