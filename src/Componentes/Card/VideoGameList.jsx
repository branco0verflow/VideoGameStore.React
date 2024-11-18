import React, { useState, useEffect } from "react";
import '../Card/VideoGameList.css';
import Loadin from '../Loadin/Loadin';
import { useNavigate } from 'react-router-dom';

// Componente para mostrar la tarjeta de videojuego
const Card = ({ videojuego, isAdmin, handleButtonClick }) => {
    return (
      <div className="card">
        <img src={videojuego.imagen} alt={videojuego.nombre} className="card-img" />
        <div className="card-content">
          <h3>{videojuego.nombre}</h3>
          <p>{videojuego.descripcion}</p>
          <p><strong>Precio:</strong> ${videojuego.precio}</p>
          <p><strong>Categoría:</strong> {videojuego.categoria}</p>
          <p><strong>Cantidad Disponible:</strong> {videojuego.cantidad}</p>
        </div>
  
        {isAdmin ? (
          <>
            <button
              className="ghost-button"
              onClick={() => handleButtonClick(videojuego, "editar")}
            >
              Editar Videojuego
            </button>
            <button
              className="ghost-button"
              onClick={() => handleButtonClick(videojuego, "eliminar")}
            >
              Eliminar Videojuego
            </button>
            <button
            className="ghost-button"
            onClick={() => handleButtonClick(videojuego)}
          >
            Ver Detalles
          </button>
          </>
        ) : (
          <button
            className="ghost-button"
            onClick={() => handleButtonClick(videojuego)}
          >
            Ver Detalles
          </button>
        )}
      </div>
    );
  };
  

const VideoGameList = ({user}) => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    if(user){
        setIsAdmin(true)
    }else{
        setIsAdmin(false)
    }
  }, [user]); 
  


  const handleButtonClick = async (videojuego, action = "detalles") => {
    if (action === "editar") {
      navigate(`/editarVideojuego/${videojuego.id}`, { state: { videojuego } });
    } else if (action === "eliminar") {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que deseas eliminar el videojuego "${videojuego.nombre}"?`
      );
  
      if (confirmDelete) {
        try {
          const response = await fetch(`http://localhost:8080/videoJuegos/${videojuego.id}`, {
            method: "DELETE",
          });
  
          if (!response.ok) {
            throw new Error("No se pudo eliminar el videojuego.");
          }
  
          alert(`El videojuego "${videojuego.nombre}" ha sido eliminado con éxito.`);
          
          window.location.reload(); // TODO pro
          setIsAdmin(true);
        } catch (error) {
          console.error("Error al eliminar el videojuego:", error);
          alert("Hubo un problema al intentar eliminar el videojuego.");
        }
      }
    } else {
      navigate(`/detalle/${videojuego.id}`, { state: { videojuego } });
    }
  };
  
  


  useEffect(() => {
    const fetchVideojuegos = async () => {
      try {
        const response = await fetch("http://localhost:8080/videoJuegos"); // Cambia la URL si es necesario
        if (!response.ok) {
          throw new Error("Error al obtener los videojuegos");
        }
        const data = await response.json();
        setVideojuegos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los videojuegos:", error);
        setLoading(false);
      }
    };

    fetchVideojuegos();
  }, []);

  if (loading) {
    return <Loadin />; // Puedes reemplazar con un componente de spinner
  }

  return (
    <div className="videojuego-grid">
      {videojuegos.map((videojuego) => (
        <Card
          key={videojuego.id}
          videojuego={videojuego}
          isAdmin={isAdmin}
          handleButtonClick={handleButtonClick}
        />
      ))}
    </div>
  );
  
};

export default VideoGameList;
