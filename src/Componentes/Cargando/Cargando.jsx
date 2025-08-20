import './Cargando.css';
import ImagenLoading from "../../Images/logo.png";

const Cargando = () => {
  return (
    <div class="spinner-container">
      <div class="spinner-grow text-light" role="status">
        <span class="sr-only"></span>
      </div>
      <img src={ImagenLoading} alt="Imagen" class="overlay-image" />
    </div>
  );
};

export default Cargando;
