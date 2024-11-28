import React, { useState, useEffect } from "react";
import AddVideoGame from "../AddVideoGame/AddVideoGame"; // Componente para agregar videojuegos
import { useNavigate } from "react-router-dom";
import VolverButton from "../VolverButton/VolverButton";
import "./ManageVideoGames.css"; // Asegúrate de importar el archivo CSS

const ManageVideoGames = () => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar la visibilidad del formulario
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Obtener los videojuegos desde el backend
  useEffect(() => {
    fetchVideoGames();
  }, []);

  // Función para obtener la lista de videojuegos
  const fetchVideoGames = async () => {
    try {
      const response = await fetch("http://localhost:8080/videoJuegos");
      if (!response.ok) throw new Error("Error al obtener videojuegos");
      const data = await response.json();
      setVideojuegos(data);
    } catch (error) {
      console.error("Error al obtener los videojuegos:", error);
    }
  };

  // Función para manejar la eliminación de un videojuego
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este videojuego?")) {
      try {
        const response = await fetch(`http://localhost:8080/videoJuegos/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el videojuego");
        setSuccessMessage("Videojuego eliminado exitosamente.");
        fetchVideoGames(); // Actualizar la lista
      } catch (error) {
        console.error("Error al eliminar el videojuego:", error);
        setErrorMessage("No se pudo eliminar el videojuego.");
      }
    }
  };

  // Función para manejar la edición de un videojuego
  const handleEdit = (videojuego) => {
    navigate(`/editarVideojuego/${videojuego.id}`); // Redirige a la página de edición
  };

  return (
    <div className="manage-video-games-container">
      <div class="text-center m-2">
      <VolverButton />
      </div>
      
      <h2 class="text-center mb-5">Administrar Videojuegos</h2>
      
      {/* Mensajes de éxito y error */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      {/* Botones para mostrar el formulario o la lista */}
      <div className="action-buttons">
        <button onClick={() => setIsFormVisible(true)} className="action-btn">Agregar Videojuego</button>
        <button onClick={() => setIsFormVisible(false)} className="action-btn">Ver Videojuegos</button>
      </div>
      
      {/* Mostrar el formulario de agregar videojuego */}
      {isFormVisible ? (
        <div className="add-video-game-container mb-3">
          <AddVideoGame refreshList={fetchVideoGames} />
        </div>
      ) : (
        // Mostrar la tabla con la lista de videojuegos
        <div>
          <h3 class="text-center m-3" >Lista de Videojuegos</h3>
          {videojuegos.length > 0 ? (
            <table className="video-game-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {videojuegos.map((videojuego) => (
                  <tr key={videojuego.id}>
                    <td>{videojuego.nombre}</td>
                    <td>{videojuego.categoria}</td>
                    <td>${videojuego.precio}</td>
                    <td>
                      <button onClick={() => handleEdit(videojuego)} className="action-btn">Editar</button>
                      <button onClick={() => handleDelete(videojuego.id)} className="action-btn">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay videojuegos disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageVideoGames;
