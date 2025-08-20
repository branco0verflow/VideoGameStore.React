import React, { useState, useEffect } from "react";
import { useUsuario } from "../UsuarioContext/UsuarioContext"
import '../CreaReserva/CreaReserva.css';
import { useNavigate } from "react-router-dom";
import imgLogo from '../../Images/logo.png';
import imag1 from '../../Images/Albo1.jpg';
import imag2 from '../../Images/Albo2.jpg';
import imag3 from '../../Images/Albo3.jpg';
import Cargando from "../Cargando/Cargando";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";

const FormularioReserva = () => {
  const { usuario } = useUsuario(); // Obtener el usuario desde el contexto


  const [socios, setSocios] = useState([]); // Lista de socios
  const [paso, setPaso] = useState(1);
  const [cortesias, setCortesias] = useState([]);
  const [horarios, setHorarios] = useState([]); // Horarios disponibles
  const [socioSeleccionado, setSocioSeleccionado] = useState(
    socios.length > 0 ? socios[0].id : null
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState(""); // Fecha seleccionada
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(""); // Horario seleccionado
  const [tipoDeCorte, setTipoDeCorte] = useState([]);
  const [tipoDeCorteSeleccionado, setTipoDeCorteSeleccionado] = useState(null);
  const [cortesiaSeleccionada, setCortesiaSeleccionada] = useState(null);
  const [cortesiaActiva, setCortesiaActiva] = useState(false);
  const [loading, setLoading] = useState(true);

  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

  const [error, setError] = useState(""); // Mensajes de error
  const navigate = useNavigate();

  // Fetch para obtener cortesías disponibles al cargar el componente
  useEffect(() => {
    fetch("https://albo-barber.onrender.com/api/cortesias")
      .then((response) => response.json())
      .then((data) => setCortesias(data)) // Correcto
      .catch((error) => console.error("Error al cargar las cortesías:", error));
  }, []);




  useEffect(() => {
    if (socios.length > 0) {
      setSocioSeleccionado(socios[0].id);
    }
  }, [socios]);

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
        setLoading(false);
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
          console.log(fechaSeleccionada);
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
      noMonetario: false,
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


  const leftImages = [
    imag1,
    imag2,
    imag3,
  ];

  const rightImages = [
    imag2,
    imag3,
    imag1,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex((prevIndex) => (prevIndex + 1) % leftImages.length);
      setRightImageIndex((prevIndex) => (prevIndex + 1) % rightImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [leftImages.length, rightImages.length]);


  return (
    <div className="background-carousel">
      <div
        className="background-half left"
        style={{ backgroundImage: `url(${leftImages[leftImageIndex]})` }}
      ></div>
      <div
        className="background-half right"
        style={{ backgroundImage: `url(${rightImages[rightImageIndex]})` }}
      ></div>
      <div className="container-gral">
        <form className="crearReservaClass" onSubmit={handleSubmit}>
          <div className="contenedor-de-logo">

            <img src={imgLogo} alt="Logo de la empresa" className="logo1" />

          </div>
          <h2 className="bungee-inline-regular">Registrar Reserva</h2>

          {paso === 1 && (
            <>
              {loading && <Cargando />} {/* Muestra un spinner o mensaje de carga */}
              <div className="field">
                <label>Seleccione barbero:</label>
                <div className="socios-container">
                  {socios.map((socio) => (
                    <div
                      key={socio.id}
                      className={`socio-card ${socioSeleccionado === socio.id ? "seleccionado" : ""}`}
                      onClick={() => setSocioSeleccionado(socio.id)}
                    >
                      <img src={socio.imagenUrl} alt={socio.nombre} onLoad={() => setLoading(false)} />
                      <div className="nombre-barbero">{socio.nombre} {socio.apellido}</div>
                    </div>
                  ))}
                </div>

              </div>




              <div className="field">
                <label>Seleccionar Fecha:</label>
                <div className="datepicker-container">
                  <DatePicker
                    selected={fechaSeleccionada ? new Date(`${fechaSeleccionada}T00:00:00`) : null} // Ajusta la fecha a medianoche local
                    onChange={(date) => {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-based
                      const dd = String(date.getDate()).padStart(2, "0");
                      setFechaSeleccionada(`${yyyy}-${mm}-${dd}`);
                    }}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Evita fechas pasadas
                    filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 1} // No permite domingos y lunes
                    placeholderText="AAAA/MM/DD"
                  />

                  <FaCalendarAlt className="calendar-icon" />
                </div>
              </div>




              <div className="siguienteDiv">
                <button className="siguiente" type="button" onClick={() => setPaso(2)} disabled={!socioSeleccionado || !fechaSeleccionada}>
                  Siguiente
                </button>
              </div>

              <div className="mis-reservas-container">
                <div className="button-group">
                  <button className="reservas-btn" onClick={() => navigate("/reservasCreadas")}>Mis Reservas</button>
                  <button className="perfil-btn" onClick={() => navigate("/miPerfil")}>Ver mi Perfil</button>
                  <button className="salir-btn" onClick={() => navigate("/")}>Salir</button>
                </div>
              </div>

            </>
          )}

          {paso === 2 && (
            <>
              <div className="field">
                <label>Seleccionar Horario:</label>
                <select
                  value={horarioSeleccionado || ""}
                  onChange={(e) => setHorarioSeleccionado(e.target.value)}
                  disabled={!horarios.length}
                >
                  <option value="">Seleccione un horario</option>
                  {horarios.map((horario, index) => (
                    <option key={index} value={horario}>{horario.split(":").slice(0, 2).join(":")}</option>
                  ))}
                </select>
              </div>

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

              <div className="field">
                <div className="switch-container">
                  <label>Cortesía:</label>
                  <label className="switch" aria-label="Seleccionar cortesía">
                    <input
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

              <div className="button-container">
                <button type="button" onClick={() => setPaso(1)}>Atrás</button>
                <button type="button" onClick={() => setPaso(3)} disabled={!horarioSeleccionado || !tipoDeCorteSeleccionado}>
                  Siguiente
                </button>
              </div>

              <div className="mis-reservas-container">
                <div className="button-group">
                  <button className="reservas-btn" onClick={() => navigate("/reservasCreadas")}>Mis Reservas</button>
                  <button className="perfil-btn" onClick={() => navigate("/miPerfil")}>Ver mi Perfil</button>
                  <button className="salir-btn" onClick={() => navigate("/")}>Salir</button>
                </div>
              </div>
            </>
          )}

          {paso === 3 && (
            <>
              <h3 className="abel-regular">Confirma los datos</h3>
              <div className="reserva-card">
                <p className="abel-regular">
                  <FaUser className="icon" /> <strong>Barbero:</strong> {socios.find(s => s.id === socioSeleccionado)?.nombre || "No especificado"}
                </p>
                <p className="abel-regular">
                  <FaCalendarAlt className="icon" /> <strong>Fecha:</strong> {fechaSeleccionada || "No especificado"}
                </p>
                <p className="abel-regular">
                  <FaClock className="icon" /> <strong>Horario:</strong> {horarioSeleccionado.split(":").slice(0, 2).join(":") || "No especificado"}
                </p>
              </div>


              <div className="button-container">
                <button type="button" className="back-btn" onClick={() => setPaso(2)}>
                  Atrás
                </button>
                <button type="submit" className="next-btn">
                  Confirmar Reserva
                </button>
              </div>

              <div className="mis-reservas-container">
                <div className="button-group">
                  <button className="reservas-btn" onClick={() => navigate("/reservasCreadas")}>Mis Reservas</button>
                  <button className="perfil-btn" onClick={() => navigate("/miPerfil")}>Ver mi Perfil</button>
                  <button className="salir-btn" onClick={() => navigate("/")}>Salir</button>
                </div>
              </div>

            </>
          )}
        </form>


      </div>
    </div>
  );
};

export default FormularioReserva;