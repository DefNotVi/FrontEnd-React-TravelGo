import { useState } from 'react';
import { Container, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/AppContext'; // Se conecta con el carrito
import { useNavigate } from 'react-router-dom';




function Checkout(){
    const [errors] = useState([]);
    // Obtener la información y funciones del carrito
    const { cartItems, cartCount } = useCart();

    // CALCULAR EL TOTAL
    // El reduce se usa para sumar el precio en la propiedad "price" de cada ítem
    const totalAPagar = cartItems.reduce((total, item) => total + (item.precio || 0), 0);
    
    // Esto añade los separadores de miles pq no c como hacerlo solo con texto o algo klsdhfksd
    const separadores = totalAPagar.toLocaleString('es-CL');

    // para redirigir :O
    const navigate = useNavigate();

    //cuando algo hace click se va ala pestaña del pago
    const handleClick = async () => {
    // Envía la reserva al backend
    await fetch('http://localhost:8081/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cliente: 'Cliente de ejemplo', // Puedes pedir el nombre en un formulario
            paqueteIds: cartItems.map(item => item.id)
        })
    });
    navigate('/pago');
    };
    
    // Esto evita que la pagina se recargue y asi react hace sus triquiñuelas
    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <main>
        <Container>
            {/*MUESTRA LOS ITEMS DEL CARRITO*/}
            <h4 className="mt-4">Productos en tu carrito:</h4>
            <ListGroup className="mb-4">
                {/*LA DE ABAJO ES UNA LÍNEA DE VERIFICACION, Verifica los items en consola de la pagina, debo quitar esto cuando termine el codigo o cuando deje de funcionar solo dsflkjhsdkf*/}
                {console.log('Items en Carrito:', cartItems)} 
                
                {cartItems.length > 0 ? (
                 //NO PUEDO CREER QUE EL "<>" DE ABAJO SEA TAN BUENO NO TENIA IDEA QUE EXISTÍA 
                 <> 
                        {/* Mapeo de items SIN modificar */}
                        {cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <span>{item.nombre || 'Nombre Desconocido'}</span>
                                <span style={{ float: 'right' }}>
                                    {item.precio ? `$${Number(item.precio).toLocaleString('es-CL')}` : ''}
                                </span>
                            </ListGroup.Item>
                        ))}
                        
                        {/*linea del total con la clave (key) para evitar errores. */}
                        <ListGroup.Item 
                            key="total" // Clave :)
                            className="d-flex justify-content-between align-items-center bg-light"
                        >
                            <h5 className="mb-0">Total a Pagar:</h5>
                            <h5 className="mb-0">{separadores}</h5>
                        </ListGroup.Item>
                    </>
                ) : (
                    <Alert variant="info">Tu carrito está vacío. Añade algunos productos!</Alert>
                )}
            </ListGroup>
            
            
            {/* Mostrar Errores de Validación */}
            {errors.length > 0 && <Alert variant="danger">{errors.join('. ')}</Alert>}

            {/* Formulario de Pago */}
            {/* Solo muestra el formulario si hay items en el carrito */}
            {cartCount > 0 && (
                <Form onSubmit={onSubmit} noValidate>
                    <Button type="submit" onClick={handleClick} >Ir a pagar</Button>
                </Form>
            )}
            
        </Container>
        </main>
    );
}

export default Checkout;
