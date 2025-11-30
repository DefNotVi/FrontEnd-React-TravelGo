import { Container, Card } from 'react-bootstrap';
// Importa useAuth para obtener el nombre del usuario logueado
import { useAuth } from '../context/AuthContext'; 

function Home(){
    // 🔑 CORRECCIÓN: Desestructura también isLoggedIn
    const { user, isLoggedIn } = useAuth();

    // 1. Definir la URL de la imagen de fondo (Cambiado a una imagen de calidad)
    const backgroundImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return (
        <main
            // APLICAMOS EL FONDO A TODA LA ETIQUETA <main>
            style={{ 
                backgroundImage: `url(${backgroundImageUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // Opcional: hace que el fondo sea fijo al hacer scroll
                minHeight: '100vh', // Asegura que el fondo cubra toda la altura de la vista
                paddingBottom: '2rem'
            }}
        >
            <Container className="my-5">
                {/* 1. Componente de Bienvenida (Banner o Jumbotron) */}
                <Card 
                    // Eliminamos el estilo de fondo de la tarjeta
                    className="text-white text-center p-0 shadow-lg"
                    style={{ 
                        borderRadius: '15px',
                        position: 'relative', 
                        overflow: 'hidden', 
                        minHeight: '400px',
                        // Aplicamos un fondo semitransparente oscuro a la Card misma para hacer el texto legible
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
                    }}
                >
                    {/* 1.1. Overlay Oscuro Semitransparente (Ya no es necesario como capa separada, 
                          pero mantenemos el div para la estructura de centrado y padding) */}
                    <div 
                        className="p-5"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            height: '100%' // Asegura que el contenido use la altura completa de la Card
                        }}
                    >
                    {/* 1.2. Contenido de Texto */}
                    <div>
                        {/* Mensaje de bienvenida condicional */}
                        <h1 className="display-4 font-weight-bold mb-3">
                            {isLoggedIn && user && user.name // 🔑 CORRECCIÓN: Verificar que user.name exista
                                ? `¡Hola, ${user.name.split(' ')[0]}!` 
                                : `Bienvenido a Travelgo 🌍`
                            }
                        </h1>
                        <p className="lead mb-4">
                            {isLoggedIn 
                                ? "Explora nuestros paquetes turísticos y comienza a planear tu próxima aventura."
                                : "Tu portal para encontrar los mejores viajes y experiencias. ¡Regístrate o Inicia Sesión!"
                            }
                        </p>
                        
                        {/* Botón de acción (opcional, para redirigir) */}
                        <a href="/paquetes" className="btn btn-warning btn-lg shadow">
                            Ver Paquetes Ahora
                        </a>
                    </div>
                    </div>
                </Card>

                {/* 2. Contenido adicional: APLICAMOS UN FONDO BLANCO CLARO A ESTE CONTENEDOR */}
                <div className="mt-5 p-4 bg-light rounded-3 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <h2>Novedades y Destinos</h2>
                    <p className="text-muted">
                        Hemos actualizado nuestra selección de destinos en Arica y el Concepción!. Revisa la sección de Paquetes para ver las ofertas de la semana.
                    </p>
                </div>
            </Container>
        </main>
    );
}

export default Home;