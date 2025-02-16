import React from 'react';
import './VolverButton.css';  // Asegúrate de importar el archivo CSS
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";

const VolverButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
      navigate(fallback); // Ir a la página de fallback si no hay historial
    
  };

  return (
    <button className="volver-button" onClick={handleBack}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
};

export default VolverButton;

