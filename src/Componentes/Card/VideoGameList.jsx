import React, { useState, useEffect, useContext } from "react";
import '../Card/VideoGameList.css';
import Loadin from '../Loadin/Loadin';
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../../context/cartContext"; // Importar el contexto

// Componente para mostrar la tarjeta de videojuego
const Card = ({ videojuego, isAdmin, handleButtonClick, isLoggedIn, navigateToLogin }) => {
  const { addToCart } = useContext(CartContext); // Usar el contexto del carrito -- Encontre que era la forma con el usoi de UseContext!! Solucionado

  const handleAddToCart = (videojuego) => {
    const cantidadSolicitada = 1; // Puedes modificar esto según la cantidad que el usuario desee agregar

    // Verificar si la cantidad solicitada es mayor a la cantidad disponible
    if (cantidadSolicitada > videojuego.cantidad) {
      alert(`Solo hay ${videojuego.cantidad} unidades disponibles de "${videojuego.nombre}".`);
      return; // Evitar agregar al carrito si no hay suficiente stock
    }

    if (isLoggedIn) {
      addToCart(videojuego, cantidadSolicitada); // Agregar al carrito si el usuario está loguea2
    } else {
      navigateToLogin(); // Redirigir al login si no está logueado
    }
  };

  return (
    <div className="card">
      <img src={videojuego.imagen} alt="imagen videojuego" className="card-img" />
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
        </>
      ) : (
        <>
          <button
            className="ghost-button"
            onClick={() => handleButtonClick(videojuego)}
          >
            Ver Detalles
          </button>

          {videojuego.cantidad > 0 ? (
            <button
              className="ghost-button"
              onClick={() => handleAddToCart(videojuego)} // Llamar a la función que valida la cantidad
            >
              Comprar
            </button>
          ) : (
            <p className="agotado">Agotado</p>
          )}
        </>
      )}
    </div>
  );
};





const VideoGameList = ({ user }) => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!user; // Verificar si el usuario está logueado

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
          setVideojuegos((prev) => prev.filter((v) => v.id !== videojuego.id)); // Actualizar la lista
        } catch (error) {
          console.error("Error al eliminar el videojuego:", error);
          alert("Hubo un problema al intentar eliminar el videojuego.");
        }
      }
    } else {
      navigate(`/detalle/${videojuego.id}`, { state: { videojuego } });
    }
  };

  const navigateToLogin = () => {
    navigate("/login"); // Redirigir al login
  };

  useEffect(() => {
    const fetchVideojuegos = async () => {
      try {
        const response = await fetch("http://localhost:8080/videoJuegos");
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
    return <Loadin />;
  }

  return (
    <div className="videojuego-grid">
      {videojuegos.map((videojuego) => (
        <Card
          key={videojuego.id}
          videojuego={videojuego}
          isAdmin={user?.role === "admin"} // Comprobar si el usuario es admin
          handleButtonClick={handleButtonClick}
          isLoggedIn={isLoggedIn} // Pasar el estado de login
          navigateToLogin={navigateToLogin} // Pasar la función de redirección al login
        />
      ))}
    </div>
  );
};


export default VideoGameList;

