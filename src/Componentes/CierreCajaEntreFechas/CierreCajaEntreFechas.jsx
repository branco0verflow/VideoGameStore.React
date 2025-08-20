import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import VolverButton from "../VolverButton/VolverButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CierresCaja = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cierres, setCierres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCierresCaja = async () => {
    if (!fechaDesde || !fechaHasta) {
      setError("Por favor selecciona ambas fechas.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://albo-barber.onrender.com/gastos/cierres-caja?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      let data = await response.json();

      // 📌 Ordenar por fecha ascendente
      data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      setCierres(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const descargarExcel = () => {
    if (cierres.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // 📌 Convertir los datos a formato Excel
    const datosParaExcel = cierres.map((cierre, index) => {
      const fechaCierre = new Date(fechaDesde);
      fechaCierre.setDate(fechaCierre.getDate() + index);

      return {
        Fecha: fechaCierre.toISOString().split("T")[0],
        Facturación: cierre.facturacion,
        Gastos: cierre.gastos,
        "Cierre Caja": cierre.cierreCaja,
        "No Monetario": cierre.noMonetario,
      };
    });

    const ws = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cierres de Caja");

    // 📥 Guardar archivo
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `CierresCaja_${fechaDesde}_a_${fechaHasta}.xlsx`);
  };



  return (
    <div className="container mt-4">
        <VolverButton fallback="/adminReservas" />
      <h2 className="bungee-inline-regular">Cierre de Caja por Día</h2>

      {/* 📅 Selección de Fechas */}
      <div className="row mb-3">
        <div className="col-md-5">
          <input
            type="date"
            className="form-control"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="date"
            className="form-control"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchCierresCaja}>
            Consultar
          </button>
        </div>
      </div>

      {/* ⚠️ Manejo de Errores */}
      {error && <div className="alert alert-danger">{error}</div>}

     

      {/* 📊 Tabla de Resultados con Bootstrap */}
      {!loading && cierres.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Fecha</th>
                  <th>Facturación</th>
                  <th>Gastos</th>
                  <th>Cierre Caja</th>
                  <th>No Monetario</th>
                </tr>
              </thead>
              <tbody>
                {cierres.map((cierre, index) => {
                  // 📅 Generar fecha correcta sumando días a fechaDesde
                  const fechaCierre = new Date(fechaDesde);
                  fechaCierre.setDate(fechaCierre.getDate() + index);

                  return (
                    <tr key={index}>
                      <td>{fechaCierre.toISOString().split("T")[0]}</td>
                      <td>${cierre.facturacion.toLocaleString()}</td>
                      <td>${cierre.gastos.toLocaleString()}</td>
                      <td>${cierre.cierreCaja.toLocaleString()}</td>
                      <td>${cierre.noMonetario.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📥 Botón para Descargar Excel */}
          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={descargarExcel}>
              Descargar Excel
            </button>
          </div>
        </>
      )}

      {/* 📭 Mensaje si no hay datos */}
      {!loading && cierres.length === 0 && !error && (
        <div className="alert alert-info text-center">
          No hay registros en este rango de fechas (Evita introducir fechas con mas de 31 días).
        </div>
      )}
    </div>
  );
};

export default CierresCaja;
