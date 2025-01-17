import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocio } from "../../Componentes/socioContext/socioContext";
import "./VerReservas.css";

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

  const fetchReservas = async (fechaSeleccionada) => {
    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/reservas/por-socio-y-fecha?socioId=${socio.id}&fecha=${fechaSeleccionada}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener reservas");
      }
      const data = await response.json();
      setReservas(data);
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
        <button onClick={handleHoy}>Hoy</button>
        <button onClick={handleManana}>Mañana</button>
        <input
          type="date"
          value={selectedDate}
          onChange={handleSeleccionarDia}
          className="fecha-selector"
        />
        <button onClick={() => navigate(-1)}>Atrás</button>
      </div>

      <h2 className="bungee-inline-regular">Para {selectedDate}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="reservas-list">
        {reservas.length === 0 ? (
          <p>No hay reservas para esta fecha.</p>
        ) : (
          reservas.map((reserva) => (
            <div key={reserva.id} className="reserva-item">
              <p>Hora: {reserva.horarioSeleccionado}</p>
              <p>Cliente: {reserva.usuario.nombre} {reserva.usuario.apellido}</p>
              <p>Telefono: {reserva.usuario.telefono} </p>
              <p>{reserva.tipoDeCorte.nombre} ${reserva.tipoDeCorte.precio}</p>
              {reserva.estado ? <p>Confirmado</p> : ""}
              {!reserva.estado && (
                <button onClick={() => confirmarReserva(reserva.id)}>
                  Confirmar
                </button>
              )}
            </div>
          ))
        )}
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

