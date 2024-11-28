import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import { CartContext } from '../../context/cartContext'; // Importamos el contexto del carrito
import { FaShoppingCart } from 'react-icons/fa'; // Ícono del carrito (puedes usar otro si lo prefieres)
import "../NavBar/NavBar.css"

function NavbarCustom({ user, handleLogout }) {
  const { cart } = useContext(CartContext); // Usamos el contexto del carrito
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculamos la cantidad total de productos

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

              {user && user.role === "admin" && (
                <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">
                  Dashboard
                </Nav.Link>
              )}

              <NavDropdown title="Más" id="basic-nav-dropdown" className="nav-dropdown-custom">
                {/* Mostrar la opción de registrarse solo si no hay un usuario logueado */}
                {!user && (
                  <NavDropdown.Item as={Link} to="/registrarUsuario" className="dropdown-item-custom">
                    Registrate
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                {user ? (
                  <>
                    <Nav.Link
                      onClick={handleLogout}
                      className="dropdown-item-custom"
                      style={{ cursor: 'pointer' }}
                    >
                      Cerrar Sesión
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login" className="dropdown-item-custom">
                      Iniciar Sesión
                    </Nav.Link>
                    <Nav.Link as={Link} to="/administradoresAutorizados" className="dropdown-item-custom">
                      Acceso restringido
                    </Nav.Link>
                  </>
                )}
              </NavDropdown>

              {/* Mostrar el carrito solo si el usuario no es un administrador */}
              {user && user.role !== "admin" && (
                <Nav.Link as={Link} to="/cart" className="nav-link-custom cart-link">
                  <FaShoppingCart className="cart-icon" />
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>} {/* Mostrar cantidad */}
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavbarCustom;
