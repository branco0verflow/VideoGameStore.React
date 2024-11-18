import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

function NavbarCustom({ user, handleLogout }) {

    
  return (
    <>
      <Navbar expand="lg" className="navbar-custom" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/Inicio" className="navbar-brand-custom">
            Game Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto"> {/* Alinea los elementos a la derecha */}
              <Nav.Link as={Link} to="/Inicio" className="nav-link-custom">Inicio</Nav.Link>
              {user && ( <Nav.Link as={Link} to="/agregarVideojuego" className="nav-link-custom">Crear VideoJuego</Nav.Link> )}
              <NavDropdown title="Más" id="basic-nav-dropdown" className="nav-dropdown-custom">
                <NavDropdown.Item as={Link} to="/registrarUsuario" className="dropdown-item-custom">Registrate</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contact" className="dropdown-item-custom">Contacto</NavDropdown.Item>
                <NavDropdown.Divider />
                {user ? (
                                <>
                                    <Nav.Link onClick={handleLogout} className="dropdown-item-custom" style={{ cursor: 'pointer' }}>Cerrar Sesión</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/administradoresAutorizados" className="dropdown-item-custom">Acceso restringido</Nav.Link>
                            )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavbarCustom;

