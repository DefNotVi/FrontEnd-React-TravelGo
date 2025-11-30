import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // 👈 Importar para redirección
import { useAuth } from '../context/AuthContext'; // 👈 Importar el hook de Auth

const API_BASE_URL = 'http://localhost:8081/api/v1/auth'; 
const LOGIN_ENDPOINT = '/login';

function Cliente() { 
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estado simplificado: solo necesitamos email y password para el login
    const [formData, setFormData] = useState({ email: '', password: '' }); 
    
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Manejadores de Estado ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Validación de Login ---

    const validate = () => {
        const errs = [];
        const { email, password } = formData;
        
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
             errs.push('El correo es obligatorio y debe ser válido');
        }
        
        // La validación de la longitud de la contraseña fue eliminada para simplificar
        if (!password.trim()) {
             errs.push('La contraseña es obligatoria');
        }
        
        setErrors(errs);
        setSuccessMessage('');
        return errs.length === 0;
    };

    // --- Manejador de Envío (Login) ---

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setLoading(true);
        
        // Endpoint fijo para Login
        const endpoint = API_BASE_URL + LOGIN_ENDPOINT; 
        const payload = { email: formData.email, password: formData.password };
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                
                // 🔑 LÍNEA CLAVE A MODIFICAR/VERIFICAR
                        // PASAR el objeto 'result' completo (que es { token: "..." })
                login(result); // <--- DEBE DECIR SÓLO login(result)

                setSuccessMessage(`¡Inicio de sesión exitoso! Redirigiendo...`);
                
                setFormData({ email: '', password: '' });
                navigate('/home', { replace: true });

            } else {
                const errorText = await response.text();
                
                // Manejar errores comunes de autenticación
                if (errorText.includes("Bad credentials") || errorText.includes("Unauthorized")) {
                    setErrors(['Credenciales incorrectas. Por favor, verifica tu email y contraseña.']);
                } else {
                    setErrors([errorText || `Error al iniciar sesión. Por favor, inténtalo de nuevo.`]);
                }
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setErrors(['Error de conexión con el servidor.']);
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    // --- Renderizado (Solo Login) ---

    return (
        <main>
            <Container style={{ maxWidth: '400px', marginTop: '10vh' }}>
                <Card className="p-4 shadow rounded-lg">
                    <h2 className="text-center mb-4">
                        Iniciar Sesión
                    </h2>
                    
                    {errors.length > 0 && <Alert variant="danger">{errors.join('. ')}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={onSubmit} noValidate>
                        
                        {/* Campo Correo */}
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                disabled={loading}
                            />
                        </Form.Group>
                        
                        {/* Campo Contraseña */}
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                disabled={loading}
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 mt-3" disabled={loading}>
                            {/* CORRECCIÓN: Usar una expresión simple para el texto del botón */}
                            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
                        </Button>
                    </Form>
                    
                    <hr />

                </Card>
            </Container>
        </main>
    );
}

export default Cliente;