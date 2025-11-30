import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


export default function ProductCard({ product, onAdd }) {
    const { id, nombre, precio, categoria, imagenUrl } = product;


    return (
        <Card className="h-100 shadow-sm card-hover">
        {imagenUrl && (
            <Card.Img
            variant="top"
            src={imagenUrl}
            alt={`Imagen de ${nombre}`}
            loading="lazy"
            style={{ objectFit: 'cover', height: 180 }}
            />
        )}
        <Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="mb-0" style={{ fontSize: '1rem', lineHeight: 1.2 }}>
                {nombre}
            </Card.Title>
            {categoria && <Badge bg="secondary">{categoria}</Badge>}
            </div>

            <Card.Text className="text-muted mb-3">
            ${Number(precio).toLocaleString('es-CL')}
            </Card.Text>

            <div className="d-flex gap-2 mt-auto">
                <Button 
                    as={Link} 
                    to={`/itinerario/${id}`} 
                    variant="outline-info" 
                    aria-label={`Ver detalles e itinerario de ${nombre}`}
                    className="flex-grow-1"
                >Itinerario</Button>

                <Button
                    variant="primary"
                    onClick={onAdd}
                    className="flex-grow-1"
                    aria-label={`Agregar ${nombre} al carrito`}
                >Reservar</Button>
            </div>
        </Card.Body>
        </Card>
    );
}