import React, { useState, useEffect } from "react";
import { useUsuario } from "../UsuarioContext/UsuarioContext"
import '../CreaReserva/CreaReserva.css';
import { useNavigate } from "react-router-dom";
import imgLogo from '../../Images/logo.png';

const FormularioReserva = () => {
  const { usuario } = useUsuario(); // Obtener el usuario desde el contexto


  const [socios, setSocios] = useState([]); // Lista de socios
  const [cortesias, setCortesias] = useState([]);
  const [horarios, setHorarios] = useState([]); // Horarios disponibles
  const [socioSeleccionado, setSocioSeleccionado] = useState(null); // Socio seleccionado
  const [fechaSeleccionada, setFechaSeleccionada] = useState(""); // Fecha seleccionada
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(""); // Horario seleccionado
  const [tipoDeCorte, setTipoDeCorte] = useState([]);
  const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState(null);
  const [cortesiaSeleccionada, setCortesiaSeleccionada] = useState(null);
  const [cortesiaActiva, setCortesiaActiva] = useState(false);

  const [error, setError] = useState(""); // Mensajes de error
  const navigate = useNavigate();

  // Fetch para obtener cortesías disponibles al cargar el componente
  useEffect(() => {
    fetch("https://albo-barber.onrender.com/api/cortesias")
      .then((response) => response.json())
      .then((data) => setCortesias(data)) // Correcto
      .catch((error) => console.error("Error al cargar las cortesías:", error));
  }, []);




  // Obtener lista de socios al cargar el componente
  useEffect(() => {
    const fetchTipoDeCorte = async () => {
      try {
        const response = await fetch("https://albo-barber.onrender.com/tipos-de-corte"); // Endpoint para obtener socios
        const data = await response.json();
        setTipoDeCorte(data);
      } catch (err) {
        setError("Error al cargar la lista de tipos de corte");
      }
    };

    fetchTipoDeCorte();
  }, []);


  // Obtener lista de socios al cargar el componente
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await fetch("https://albo-barber.onrender.com/api/socios"); // Endpoint para obtener socios
        const data = await response.json();
        setSocios(data);
      } catch (err) {
        setError("Error al cargar la lista de socios");
      }
    };

    fetchSocios();
  }, []);

  // Obtener horarios disponibles en base al socio y la fecha seleccionada
  useEffect(() => {
    const fetchHorarios = async () => {
      if (socioSeleccionado && fechaSeleccionada) {
        try {
          const [anio, mes, dia] = fechaSeleccionada.split("-");
          const response = await fetch(
            `https://albo-barber.onrender.com/reservas/horarios-disponibles/${socioSeleccionado}?anio=${anio}&mes=${mes}&dia=${dia}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los horarios disponibles");
          }
          const data = await response.json();
          setHorarios(data); // Actualiza los horarios disponibles
        } catch (err) {
          setError("Error al cargar los horarios disponibles");
          console.error(err); // Para depurar el error
        }
      }
    };

    fetchHorarios();
  }, [socioSeleccionado, fechaSeleccionada]);



  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();



    const reserva = {
      fechaSeleccionada,
      horarioSeleccionado,
      tipoDeCorte: { id: tipoDeCorteSeleccionado }, // Solo el ID seleccionado
      usuario,
      estado: false,
      cortesia: { id: cortesiaActiva ? cortesiaSeleccionada : 1 },
      socio: { id: socioSeleccionado },
    };





    if (!socioSeleccionado || !fechaSeleccionada || !horarioSeleccionado) {
      setError("Por favor, complete todos los campos");
      return;
    }

    if (!usuario) {
      alert("Debe iniciar sesión para hacer una reserva");
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
        console.log("Fecha seleccionada:", fechaSeleccionada);

        alert("Reserva confirmada");
        setSocioSeleccionado(null);
        setFechaSeleccionada("");
        setHorarioSeleccionado("");
        setHorarios([]);
        setError("");
      } else {
        setError("Error al confirmar la reserva");
      }
    } catch (err) {
      setError("Error al enviar la solicitud");
    }

  };


  return (
    <div className="container-gral">
      <form onSubmit={handleSubmit}>
        <img src={imgLogo} alt="Logo de la empresa" className="logo1" />
        <h2 className="bungee-inline-regular">Registrar Reserva</h2>
        {error && <p className="error">{error}</p>}

        {/* Selección de Socio */}
        <div className="field">
          <label>Seleccione barbero:</label>
          <div className="socios-container">
            {socios.map((socio) => (
              <div
                key={socio.id}
                className={`socio-card ${socioSeleccionado === socio.id ? "seleccionado" : ""
                  }`}
                onClick={() => setSocioSeleccionado(socio.id)}
              >
                <img src={socio.imagenUrl} alt={socio.nombre} />
                <p>
                  {socio.nombre} {socio.apellido}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selección de Fecha */}
        <div className="field">
          <label>Seleccionar Fecha:</label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />
        </div>

        {/* Selección de Horario */}
        <div className="field">
          <label>Seleccionar Horario:</label>
          <select
            value={horarioSeleccionado || ""}
            onChange={(e) => setHorarioSeleccionado(e.target.value)}
            disabled={!horarios.length}
          >
            <option value="">Seleccione un horario</option>
            {horarios.map((horario, index) => (
              <option key={index} value={horario}>
                {horario}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de Tipo de Corte */}
        <div className="field">
          <label>Tipo de Corte:</label>
          <select
            value={tipoDeCorteSeleccionado || ""}
            onChange={(e) => setTipoDeCorteSeleccionado(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo de corte</option>
            {tipoDeCorte.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre || "Sin descripción"} ${tipo.precio}
              </option>
            ))}
          </select>
        </div>

        {/* Cortesía */}
        <div className="field">
          <div className="switch-container">
            <label>Cortesía:</label>
            <label className="switch">
              <input
                id="lo"
                type="checkbox"
                checked={cortesiaActiva}
                onChange={(e) => setCortesiaActiva(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {cortesiaActiva && (
            <select
              value={cortesiaSeleccionada || ""}
              onChange={(e) => setCortesiaSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una cortesía</option>
              {cortesias.map((cortesia) => (
                <option key={cortesia.id} value={cortesia.id}>
                  {cortesia.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          type="submit"
          disabled={!socioSeleccionado || !fechaSeleccionada || !horarioSeleccionado}
        >
          Confirmar Reserva
        </button>
        <div className="mis-reservas-container" role="navigation">
          <div className="button-group">
            <button
              type="button"
              className="reservas-btn"
              aria-label="Ir a mis reservas"
              onClick={() => navigate("/reservasCreadas")}
            >
              Mis Reservas
            </button>
            <button
              type="button"
              className="perfil-btn"
              aria-label="Ir a mi perfil"
              onClick={() => navigate("/miPerfil")}
            >
              Ver mi Perfil
            </button>
            <button
              type="button"
              className="salir-btn"
              aria-label="Salir"
              onClick={() => navigate(-1)}
            >
              Salir
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default FormularioReserva;