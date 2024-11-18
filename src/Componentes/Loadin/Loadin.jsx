import {Spinner} from 'react-bootstrap';
import '../Loadin/Loadin.css';

function Cargando() {

  return (
  <div className='contenedor-cargando'>
  <Spinner className='spinner' animation="grow" variant="blue" size="lg" />
  </div>
  )
};

export default Cargando;