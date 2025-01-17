import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminBarberos.css";

const AdministrarBarberos = () => {
  const navigate = useNavigate();
  const [barberos, setBarberos] = useState([]);
  const [nuevoBarbero, setNuevoBarbero] = useState({
    nombre: "",
    apellido: "",
    imagenUrl: "",
    contra: "",
    admin: false,
  });
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null); // Para edición

  useEffect(() => {
    fetchBarberos();
  }, []);

  const fetchBarberos = async () => {
    try {
      const response = await fetch("https://albo-barber.onrender.com/api/socios");
      const data = await response.json();
      setBarberos(data);
    } catch (error) {
      console.error("Error al obtener los barberos:", error);
    }
  };

  const handleCrearBarbero = async () => {
    try {
      const response = await fetch("https://albo-barber.onrender.com/api/socios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoBarbero),
      });

      if (response.ok) {
        fetchBarberos();
        setNuevoBarbero({ nombre: "", apellido: "", imagenUrl: "", contra: "", admin: false });
      } else {
        console.error("Error al crear el barbero");
      }
    } catch (error) {
      console.error("Error al crear el barbero:", error);
    }
  };

  const handleEliminarBarbero = async (id) => {
    try {
      const response = await fetch(`https://albo-barber.onrender.com/api/socios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBarberos();
      } else {
        console.error("Error al eliminar el barbero");
      }
    } catch (error) {
      console.error("Error al eliminar el barbero:", error);
    }
  };

  const handleModificarBarbero = async () => {
    if (!barberoSeleccionado) return;

    try {
      const response = await fetch(`https://albo-barber.onrender.com/api/socios/${barberoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(barberoSeleccionado),
      });

      if (response.ok) {
        fetchBarberos();
        setBarberoSeleccionado(null); // Cierra el formulario de edición
      } else {
        console.error("Error al modificar el barbero");
      }
    } catch (error) {
      console.error("Error al modificar el barbero:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const targetValue = type === "checkbox" ? checked : value;

    if (barberoSeleccionado) {
      setBarberoSeleccionado((prev) => ({ ...prev, [name]: targetValue }));
    } else {
      setNuevoBarbero((prev) => ({ ...prev, [name]: targetValue }));
    }
  };

  const startEditingBarbero = (barbero) => {
    setBarberoSeleccionado(barbero);
  };

  return (
    <div className="administrar-barberos-container">
      <div className="header">
        <button className="btn-atras" onClick={() => navigate(-1)}>
          Atrás
        </button>
        <button className="btn-crear" onClick={handleCrearBarbero}>
          Crear nuevo
        </button>
      </div>

      <div className="formulario">
        <h3>{barberoSeleccionado ? "Modificar Barbero" : "Crear Nuevo Barbero"}</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={barberoSeleccionado ? barberoSeleccionado.nombre : nuevoBarbero.nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={barberoSeleccionado ? barberoSeleccionado.apellido : nuevoBarbero.apellido}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagenUrl"
          placeholder="URL de imagen"
          value={barberoSeleccionado ? barberoSeleccionado.imagenUrl : nuevoBarbero.imagenUrl}
          onChange={handleChange}
        />
        <input
          type="password"
          name="contra"
          placeholder="Contraseña"
          value={barberoSeleccionado ? barberoSeleccionado.contra : nuevoBarbero.contra}
          onChange={handleChange}
        />
        <label>
          Admin:
          <input
            type="checkbox"
            name="admin"
            checked={barberoSeleccionado ? barberoSeleccionado.admin : nuevoBarbero.admin}
            onChange={handleChange}
          />
        </label>
        {barberoSeleccionado && (
          <button className="btn-modificar" onClick={handleModificarBarbero}>
            Guardar cambios
          </button>
        )}
      </div>

      <div className="barberos-list">
        {barberos.map((barbero) => (
          <div key={barbero.id} className="barbero-item">
            <img src={barbero.imagenUrl} alt={barbero.nombre} className="barbero-imagen" />
            <p>{barbero.nombre} {barbero.apellido}</p>
            <button className="btn-eliminar" onClick={() => handleEliminarBarbero(barbero.id)}>
              Eliminar barbero
            </button>
            <button className="btn-eliminar" onClick={() => startEditingBarbero(barbero)}>
              Modificar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdministrarBarberos;
