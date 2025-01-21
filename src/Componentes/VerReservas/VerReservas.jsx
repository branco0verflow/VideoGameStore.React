import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import "./VerReservas.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faClock, faUser, faMobile, faScissors } from '@fortawesome/free-solid-svg-icons';
import VolverButton from "../VolverButton/VolverButton";


const VerReservas = () => {
  const { socio } = useSocio();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [facturacion, setFacturacion] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [cierreCaja, setCierreCaja] = useState(0);
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: "", monto: "" });
  const [listaGastos, setListaGastos] = useState([]);
  const [error, setError] = useState("");
  const [horariosDisponibles, setHorarios] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const fetchReservas = async (fechaSeleccionada) => {
    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/reservas/por-socio-y-fecha?socioId=${socio.id}&fecha=${fechaSeleccionada}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener reservas");
      }
      const data = response.status === 204 || response.headers.get("Content-Length") === "0"
        ? []
        : await response.json();

      setReservas(data); // Actualiza las reservas incluso si está vacío
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las reservas o no hay para este día.");
    }
  };




  const fetchCierreCaja = async (fechaSeleccionada) => {
    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/gastos/cierre-caja?fecha=${fechaSeleccionada}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener cierre de caja");
      }
      const data = await response.json();
      setFacturacion(data.facturacion);
      setGastos(data.gastos);
      console.log(data.gastos);
      console.log("Id del Socio: ", socio.id);
      setCierreCaja(data.cierreCaja);
    } catch (err) {
      console.error(err);
      setError("Error al calcular el cierre de caja.");
    }
  };

  const agregarGasto = async () => {
    try {
      const response = await fetch(`https://albo-barber.onrender.com/gastos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: selectedDate,
          descripcion: nuevoGasto.descripcion,
          monto: parseFloat(nuevoGasto.monto),
        }),
      });
      if (!response.ok) {
        throw new Error("Error al agregar gasto");
      }
      alert("Gasto agregado con éxito.");
      setNuevoGasto({ descripcion: "", monto: "" });
      fetchCierreCaja(selectedDate); // Actualizar datos
      console.log("La fecha seleccionada: ", selectedDate)
    } catch (err) {
      console.error(err);
      alert("Error al agregar el gasto.");
    }
  };

  const confirmarReserva = async (reservaId) => {
    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/reservas/${reservaId}/confirmar`,
        { method: "PATCH" }
      );
      if (response.ok) {
        alert("Reserva confirmada con éxito.");
        fetchReservas(selectedDate); // Refrescar la lista
        fetchCierreCaja(selectedDate); // Actualizar datos
      } else {
        alert("Error al confirmar la reserva.");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al intentar confirmar la reserva.");
    }
  };

  const eliminarReserva = async (reservaId) => {
    try {
      const response = await fetch(`https://albo-barber.onrender.com/reservas/${reservaId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la reserva");
      }
      // Actualizar la lista de reservas eliminando la reserva cancelada
      setReservas((prevReservas) =>
        prevReservas.filter((reserva) => reserva.id !== reservaId)
      );
      alert("Reserva eliminar con éxito");
    } catch (err) {
      alert(`Error al eliminar la reserva: ${err.message}`);
      console.log(reservaId);
    }
  };

  const fetchGastosDelDia = async (fechaSeleccionada) => {
    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/gastos/por-fecha?fecha=${fechaSeleccionada}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los gastos del día");
      }
      const data = await response.json();
      setListaGastos(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los gastos del día.");
    }
  };

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
          console.log("se ejecuta fetch de hora", data);
        } catch (err) {
          console.error("Error al cargar los horarios disponibles", err);
        }
      }
    };

    fetchHorarios();
  }, [socio, selectedDate]);

  useEffect(() => {
    fetchReservas(selectedDate);
    fetchCierreCaja(selectedDate);
    fetchGastosDelDia(selectedDate);
  }, [selectedDate]);

  const handleHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setSelectedDate(hoy);
  };

  const handleManana = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    setSelectedDate(manana.toISOString().split("T")[0]);
  };

  const handleSeleccionarDia = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="ver-reservas-container">
      <div className="botones-container">
        <button className="button-rounded" onClick={handleHoy}>Hoy</button>
        <button className="button-rounded" onClick={handleManana}>Mañana</button>
        <input
          type="date"
          value={selectedDate}
          onChange={handleSeleccionarDia}
          className="fecha-selector"
        />
        <VolverButton />
      </div>

      <h2 className="bungee-inline-regular">Para {selectedDate}</h2>
      <div className="reservas-list">
        {reservas.length === 0 ? (
          <p>No hay reservas para esta fecha.</p>
        ) : (
          reservas.map((reserva) => (
            <div key={reserva.id} className="reserva-item">
              <p className="abel-regular"><FontAwesomeIcon icon={faClock} /> <strong>{reserva.horarioSeleccionado}</strong> </p>
              <p className="abel-regular"><FontAwesomeIcon icon={faUser} /> {reserva.usuario.nombre} {reserva.usuario.apellido}</p>
              <p className="abel-regular"><FontAwesomeIcon icon={faMobile} /> {reserva.usuario.telefono} </p>
              <p className="abel-regular"><FontAwesomeIcon icon={faScissors} /> {reserva.tipoDeCorte.nombre} ${reserva.tipoDeCorte.precio}</p>
              {!reserva.estado && (
                <button onClick={() => confirmarReserva(reserva.id)}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              )}
              {!reserva.estado ? (
                <button onClick={() => eliminarReserva(reserva.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ) : ""}
            </div>
          ))
        )}
        <div className="horarios-disponibles">
          {horariosDisponibles.map((hora, index) => (
            <button
              key={index}
              className="horario-boton"
              onClick={() => navigate('/crearReserva', { state: { selectedDate, hora } })}
            >
              {hora}
            </button>
          ))}
        </div>
      </div>

      <div className="cierre-caja-container">
        <h3 className="bungee-inline-regular">Cierre de Caja</h3>
        <p className="bungee-inline-regular">Total Facturado: ${facturacion}</p>
        <p className="bungee-inline-regular">Total Gastos: ${gastos}</p>
        <p className="bungee-inline-regular">Cierre de Caja: ${cierreCaja}</p>

        <div className="nuevo-gasto-form">
          <h4 className="bungee-inline-regular">Agregar Gasto</h4>
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoGasto.descripcion}
            onChange={(e) =>
              setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Monto"
            value={nuevoGasto.monto}
            onChange={(e) =>
              setNuevoGasto({ ...nuevoGasto, monto: e.target.value })
            }
          />
          <button onClick={agregarGasto}>Agregar Gasto</button>
        </div>
      </div>
      <div className="gastos-container">
        <h3 className="bungee-inline-regular">Gastos del día</h3>
        {listaGastos.length === 0 ? (
          <p className="bungee-inline-regular">No hay gastos registrados para este día.</p>
        ) : (
          <ul>
            {listaGastos.map((gasto) => (
              <li key={gasto.id}>
                <p className="bungee-inline-regular">{gasto.descripcion} ${gasto.monto.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default VerReservas;

