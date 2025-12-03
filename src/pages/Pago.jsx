import { useState } from 'react';
import { Container, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/AppContext'; // Se conecta con el carrito

//TODO ESTO ESCENCIALMENTE ES UNA COPIA DE REERVA.JSX ANTES DE EDITARLO

function Checkout(){
    const [errors, setErrors] = useState([]);
    // 💡 Obtener la información y funciones del carrito
    const { cartItems, resetCart, cartCount } = useCart();

    // CALCULAR EL TOTAL
    // El reduce se usa para sumar el precio en la propiedad "price" de cada ítem
    const totalAPagar = cartItems.reduce((total, item) => total + (item.precio || 0), 0);
    
    // Esto añade los separadores de miles pq no c como hacerlo solo con texto o algo klsdhfksd
    const separadores = totalAPagar.toLocaleString('es-CL');
    
    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones de formulario para ol nombre email y cosos
        const data = new FormData(e.currentTarget);
        const name = (data.get('name') || '').trim();
        const email = (data.get('email') || '').trim();
        const tarjeta = (data.get('tarjeta') || '').trim();

        const errs = [];
        if(!name) errs.push('El nombre es obligatorio');
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('El correo es obligatorio y debe ser válido');
        if(!tarjeta) errs.push('La tarjeta es obligatoria');
       
        //Validación que el carrito no esté vacío
        if (cartCount === 0) {
            errs.push('El carrito está vacío. Añade productos antes de pagar.');
        }

        setErrors(errs);

        // Si no hay errores resetea el carrito y tira la alerta esa
        if (errs.length === 0) {
                // Enviar reserva al backend
                await fetch('http://localhost:8081/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cliente: name,
                        paqueteIds: cartItems.map(item => item.id)
                    })
                });
                alert("Pago exitoso!");
                resetCart();
            }
        };

    return (
        <main>
        <Container>
            <h2>Realizar Pago ({cartCount} {cartCount === 1 ? 'ítem' : 'items'})</h2>
            
            {/*Muestra los items del carrito*/}
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

                    <Form.Group className="mb-3" controlId="tarjeta">
                        <Form.Label>Tarjeta de credito/debito</Form.Label>
                        <Form.Control type="tarjeta" name="tarjeta" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="name" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" name="email" required />
                    </Form.Group>

                    <Button type="submit" variant="success">Pagar y Finalizar Compra</Button>
                </Form>
            )}
            
        </Container>
        </main>
    );
}

export default Checkout;
