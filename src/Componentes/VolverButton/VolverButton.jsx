import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VolverButton.css';  // Asegúrate de importar el archivo CSS

const VolverButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);  // Esto hará que el usuario vuelva a la página anterior
  };

  return (
    <button className="volver-button" onClick={handleBack}>
      Volver hacia atrás
    </button>
  );
};

export default VolverButton;
