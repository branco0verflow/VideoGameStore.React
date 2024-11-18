import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Game Store</h2>
        </div>

        <div className="footer-links">
          <a href="/about">Acerca de nosotros</a>
          <a href="/contact">Contacto</a>
          <a href="/terms">Términos y condiciones</a>
          <a href="/privacy">Política de privacidad</a>
        </div>

        <div className="footer-social">
          <a href="https://facebook.com" title="FB" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" title="FB" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" title="FB" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://youtube.com" title="FB" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Game Store. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
