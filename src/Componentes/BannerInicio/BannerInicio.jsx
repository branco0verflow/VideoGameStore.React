import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import './BannerInicio.css';
import image2 from '../../Images/sony.jpg'
import image6 from '../../Images/gta.jpg'
import image5 from '../../Images/Play.jpg'
import VideoGameList from '../Card/VideoGameList';
import Footer from '../NavBar/Footer';

function BannerInicio({user}) {

  return (
    <>
      <div>
        <div className="carousel-container">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image5}
                alt="Primera Imagen"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image6}
                alt="Segunda Imagen"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image2}
                alt="Tercera Imagen"
              />
            </Carousel.Item>
          </Carousel>
          <div className="overlay-text">
            <h1>Tenemos lo que buscas</h1>
            <h4>Usuarios Premium con Descuentos Únicos</h4>
          </div>
        </div>
        <VideoGameList user={user} />
      </div>
      <Footer />
    </>
  );
}

export default BannerInicio;