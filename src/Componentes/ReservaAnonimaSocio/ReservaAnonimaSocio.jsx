import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import VolverButton from "../VolverButton/VolverButton";

const CreaReservaAnonima = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDate, hora } = location.state || {};
    const fechaSeleccionada = selectedDate;
    const horarioSeleccionado = hora;

    const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [telefonoCliente, setTelefonoCliente] = useState("");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
    const [usarDatosManual, setUsarDatosManual] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [tiposDeCorte, setTiposDeCorte] = useState([]);
    const [error, setError] = useState("");
    const { socio } = useSocio();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resTipos = await fetch("https://albo-barber.onrender.com/tipos-de-corte");
                const resUsuarios = await fetch("https://albo-barber.onrender.com/usuarios");

                const tiposData = await resTipos.json();
                const usuariosData = await resUsuarios.json();

                setTiposDeCorte(tiposData);
                setUsuarios(usuariosData);
            } catch (err) {
                console.error("Error al cargar datos", err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fechaSeleccionada || !horarioSeleccionado) {
            setError("Falta la fecha u hora seleccionada.");
            return;
        }

        if (!tipoDeCorteSeleccionado) {
            setError("Debe seleccionar un tipo de corte.");
            return;
        }

        let reserva;
        if (usarDatosManual) {
            if (!nombreCliente) {
                setError("Debe ingresar un nombre si usa el modo manual.");
                return;
            }
            reserva = {
                fechaSeleccionada,
                horarioSeleccionado,
                tipoDeCorte: { id: tipoDeCorteSeleccionado },
                nombreCliente, // Ahora va directamente en la reserva
                telefonoCliente: telefonoCliente || null, // Si no se ingresa, se envía null
                estado: false,
                cortesia: { id: 1 },
                socio: { id: socio.id }
            };
        } else {
            if (!usuarioSeleccionado) {
                setError("Debe seleccionar un usuario registrado o ingresar un nombre.");
                return;
            }
            reserva = {
                fechaSeleccionada,
                horarioSeleccionado,
                tipoDeCorte: { id: tipoDeCorteSeleccionado },
                usuario: { id: Number(usuarioSeleccionado) }, // Enviamos el ID del usuario
                estado: false,
                cortesia: { id: 1 },
                socio: { id: socio.id }
            };
        }

        console.log("Reserva a enviar:", JSON.stringify(reserva, null, 2));

        try {
            const response = await fetch("https://albo-barber.onrender.com/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva),
            });

            if (response.ok) {
                alert("Reserva confirmada");
                navigate(-1);
            } else {
                setError("Error al confirmar la reserva");
            }
        } catch (err) {
            console.error("Error al realizar la reserva", err);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="boton-atras">
                <VolverButton fallback="/crearReserva" />
            </div>
            <div>
                <label>Tipo de Corte:</label>
                <select value={tipoDeCorteSeleccionado} onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)} required>
                    <option value="">Seleccione un tipo de corte</option>
                    {tiposDeCorte.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre} - ${tipo.precio}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>¿Ingresar datos manualmente?</label>
                <input type="checkbox" checked={usarDatosManual} onChange={(e) => setUsarDatosManual(e.target.checked)} />
            </div>

            {!usarDatosManual ? (
                <div>
                    <label>Usuario registrado:</label>
                    <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(Number(e.target.value))} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>{user.nombre} ({user.nombreUsuario})</option>
                        ))}
                    </select>
                </div>
            ) : (
                <>
                    <div>
                        <label>Nombre del Cliente:</label>
                        <input type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />
                    </div>
                    <div>
                        <label>Teléfono (opcional):</label>
                        <input type="text" value={telefonoCliente} onChange={(e) => setTelefonoCliente(e.target.value)} />
                    </div>
                </>
            )}

            <button type="submit">Confirmar Reserva</button>
        </form>
    );
};

export default CreaReservaAnonima;
