import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// 💡 Importar el hook de carrito para la funcionalidad
import { useCart } from '../context/AppContext'; 

// URL base de tu API (Asegúrate de que esta URL sea correcta)
const API_BASE_URL = 'http://localhost:8081/api'; 

// --- Función Auxiliar para Iconos (Mejora la legibilidad) ---
const ActivityItem = ({ actividad }) => (
    <div className="d-flex align-items-center mb-2">
        {/* Usamos un icono de lista/actividad */}
        <i className="bi bi-geo-alt-fill text-primary me-2"></i> 
        <p className="mb-0">{actividad}</p>
    </div>
);

export default function Itinerario() {
    const { id } = useParams(); 
    const { user, isLoggedIn, logout } = useAuth(); 
    // 💡 Hook de carrito
    const { addToCart } = useCart();
    
    // ESTADOS PARA LA CARGA DE DATOS
    const [paquete, setPaquete] = useState(null);
    const [itinerario, setItinerario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Manejador del botón de reserva
    const handleAddToCart = () => {
        if (paquete) {
            addToCart(paquete);
            alert(`¡El paquete "${paquete.nombre}" ha sido agregado a tus reservas!`);
        }
    };

    // EFECTO PARA LA CARGA DE DATOS DEL BACKEND
    useEffect(() => {
        if (!isLoggedIn || !user || !user.token) {
            setLoading(false);
            logout(); 
            setError("No autorizado. Redirigiendo al inicio de sesión.");
            return;
        }

        const url = `${API_BASE_URL}/paquetes/${id}`; 

        const fetchItinerario = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        logout(); 
                        throw new Error(`Acceso denegado. Código de error: ${response.status}. Por favor, inicia sesión de nuevo.`);
                    }
                    throw new Error(`Paquete turístico no encontrado (ID: ${id}). Código de error: ${response.status}`);
                }
                
                const data = await response.json(); 
                
                setPaquete(data);
                setItinerario(data.itinerary || []); 
                

            } catch (err) {
                console.error("Error al cargar el itinerario:", err);
                // Si la respuesta es 401 (Acceso denegado), forzamos el error.
                if (err.message.includes('401')) {
                    setError('Acceso denegado. Por favor, inicia sesión de nuevo.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItinerario();
    }, [id, isLoggedIn, user, logout]);

    // RENDERING CONDICIONAL
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Cargando itinerario del paquete con ID: {id}...</p>
            </Container>
        );
    }
    
    if (error || !paquete) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    <h1>Paquete No Encontrado o Error 😞</h1>
                    <p className="lead">{error || `El paquete turístico con ID: ${id} no existe o no se pudo cargar.`}</p>
                </Alert>
                <Button as={Link} to="/paquetes" variant="primary">Volver a Paquetes</Button>
            </Container>
        );
    }

    // Agrupación por día (No se cambia, está bien)
    const itineraryBydia = itinerario.reduce((acc, item) => {
        (acc[item.dia] = acc[item.dia] || []).push(item.actividad);
        return acc;
    }, {});

    return (
        <Container className="my-5">
            <Button as={Link} to="/paquetes" variant="outline-primary" className="mb-4">
                ← Volver a la lista
            </Button>
            
            {/* ENCABEZADO PRINCIPAL */}
            <h1 className="display-4 fw-bold mb-1">{paquete.nombre} </h1>
            <p className="lead text-muted mb-5">{paquete.descripcion}</p>

            {/* Fila principal: Se mantiene el layout de dos columnas (4 y 8) */}
            <Row className="g-5">
                {/* COLUMNA IZQUIERDA: TARJETA DE RESUMEN (Sticky para seguir el scroll) */}
                <Col md={4}>
                    <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
                        <Card.Img 
                            variant="top" 
                            src={paquete.imagenUrl} 
                            alt={`Imagen de ${paquete.nombre}`}
                            style={{ objectFit: 'cover', height: 200 }}
                        />
                        <Card.Body>
                            {/* Precio más destacado */}
                            <Card.Title className="text-primary fs-3 fw-bold text-center">
                                ${Number(paquete.precio).toLocaleString('es-CL')}
                            </Card.Title>
                            <hr />
                            <Card.Text className="mb-2">
                                <i className="bi bi-clock-fill me-2 text-info"></i> 
                                Duración: **{paquete.categoria}**
                            </Card.Text>
                            <Card.Text className="mb-3">
                                <i className="bi bi-geo-alt-fill me-2 text-info"></i> 
                                **{paquete.nombre}**
                            </Card.Text>
                            
                            {/* BOTÓN CON LÓGICA DE CARRITO (YA NO ESTÁ DISABLED) */}
                            <Button 
                                variant="success" 
                                className="w-100 mt-2"
                                onClick={handleAddToCart}
                            >
                                Agregar a Reservas
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* COLUMNA DERECHA: ITINERARIO DETALLADO */}
                <Col md={8}>
                    <h2 className="mb-4 border-bottom pb-2">Itinerario Detallado</h2>
                    {itinerario && itinerario.length > 0 ? (
                        Object.keys(itineraryBydia).map(dia => (
                            <Card key={dia} className="mb-4 shadow-sm border-secondary">
                                <Card.Header as="h5" className="bg-light text-primary">
                                    <i className="bi bi-calendar-check me-2"></i> 
                                    Día {dia}
                                </Card.Header>
                                <div className="p-3"> 
                                    {itineraryBydia[dia].map((actividad, index) => (
                                        <ActivityItem key={index} actividad={actividad} />
                                    ))}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Alert variant="info">No hay un itinerario detallado disponible para este paquete.</Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
}