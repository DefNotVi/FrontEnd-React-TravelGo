import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/AppContext';
import { useAuth } from '../context/AuthContext'; 

function NavBar(){
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth(); // Obtener el estado y la función logout
    const location = useLocation(); // Obtener el objeto de ubicación actual

    const loginPath = '/cliente'; // Define la ruta de tu componente de login



    //  Si el usuario NO está logueado, no mostramos el Navbar.
    if (!isLoggedIn|| location.pathname === loginPath) {
        return null;
    }

    //  Si el usuario SÍ está logueado, mostramos el Navbar.
    return (
        <Navbar bg="light" expand="md" className="mb-3 border-bottom">
        <Container>
            <Navbar.Brand as={Link} to="/home">Mi App</Navbar.Brand> {/* Cambiado a /inicio */}
            <Navbar.Toggle />
            <Navbar.Collapse>
            
            {/* Links Protegidos */}
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/home">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/paquetes">Paquetes</Nav.Link>
            </Nav>
            
            {/* Links de Usuario y Carrito */}
            <Nav>
                {/* Saludo al usuario */}
                <Nav.Link disabled>
                    Bienvenido, {user?.name || 'Cliente'}
                </Nav.Link>
                
                {/* Enlace a Reservas/Carrito */}
                <Nav.Link as={Link} to="/reservas">
                🛒 <Badge bg="primary" pill>{cartCount}</Badge>
                </Nav.Link>
                
                {/* Botón de Cerrar Sesión */}
                <Nav.Link onClick={logout} as={Link} to="/cliente" style={{ cursor: 'pointer' }}>
                    Cerrar Sesión
                </Nav.Link>
            </Nav>
            
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavBar;