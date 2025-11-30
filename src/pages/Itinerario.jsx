import { useParams, Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { TRAVELING_DESTINATION } from '../data/Travel.mock';

// Componente de la página de itinerario
export default function Itinerario() {
    // Obtener el parámetro 'id' de la URL
    const { id } = useParams(); 
    const packageId = parseInt(id);

    // Buscar el paquete por ID
    const product = TRAVELING_DESTINATION.find(p => p.id === packageId);

    // Si el producto no existe
    if (!product) {
        return (
            <Container className="text-center mt-5">
                <h1>Paquete No Encontrado 😞</h1>
                <p>El paquete turístico con ID: {id} no existe.</p>
                <Button as={Link} to="/paquetes" variant="primary">Volver a Paquetes</Button>
            </Container>
        );
    }

    // Preparar el itinerario agrupando las actividades por día
    const itineraryBydia = product.itinerary ? 
        product.itinerary.reduce((acc, item) => {
            (acc[item.dia] = acc[item.dia] || []).push(item.actividad);
            return acc;
        }, {}) : {};

    return (
        <Container className="my-5">
            <Button as={Link} to="/paquetes" variant="outline-secondary" className="mb-4">
                ← Volver a la lista
            </Button>
            
            <h1 className="mb-4">Itinerario de: {product.name} </h1>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Img 
                            variant="top" 
                            src={product.imageUrl} 
                            alt={`Imagen de ${product.name}`}
                            style={{ objectFit: 'cover', height: 250 }}
                        />
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>
                                Precio: ${Number(product.price).toLocaleString('es-CL')} <br/>
                                Categoria de horas de viaje: {product.category}
                            </Card.Text>
                            {/* Aquí se podría agregar un botón para "Agregar a Reservas" pero como no sale añadir esto en la rubrica pues jiji */}
                            <Button variant="primary" disabled>
                                Botón hipotetico de nombre "Agregar a Reservas"
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Aquí se ponen lo que se va a hacer en el dia separado por las filas*/}
                <Col md={8}>
                    <h2>Itinerario del viaje</h2>
                    {product.itinerary && product.itinerary.length > 0 ? (
                        Object.keys(itineraryBydia).map(dia => (
                            <Card key={dia} className="mb-3 shadow-sm">
                                <Card.Header as="h5">Día {dia}</Card.Header>
                                <ListGroup variant="flush">
                                    {itineraryBydia[dia].map((actividad, index) => (
                                        <ListGroup.Item key={index}>
                                            <span className="me-2">-</span> {actividad}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted">No hay un itinerario disponible para este paquete.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}