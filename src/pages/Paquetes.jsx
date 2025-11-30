// Paquetes.jsx

import { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap'; // Añadimos Alert para errores
import { useAuth } from '../context/AuthContext'; // 🔑 IMPORTANTE: Importar useAuth
import { useCart } from '../context/AppContext';
import Filters from '../components/paquetes/Filters';
import ProductGrid from '../components/paquetes/ProductGrid';

const API_URL = 'http://localhost:8081/api/paquetes'; // URL corregida

export default function Paquete() {
  const { addToCart } = useCart();
    const { user, isLoggedIn } = useAuth(); // 🔑 Obtener el usuario y el token
  const [filter, setFilter] = useState('all');
  const [paquetes, setPaquetes] = useState([]);
    const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
        // Solo intentar cargar si el usuario está logueado y tiene token
        if (!isLoggedIn || !user || !user.token) {
            setError("Debes iniciar sesión para ver los paquetes.");
            return;
        }
        
        const fetchPaquetes = async () => {
            setError(null);
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 🔑 AÑADIR AUTORIZACIÓN CON EL TOKEN DEL USUARIO
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    // Si el servidor devuelve 401 o 403
                    const errorBody = await response.text(); 
                    if (response.status === 401 || response.status === 403) {
                         throw new Error("No autorizado. Por favor, inicia sesión.");
                    }
                    // Si falla por cuerpo JSON vacío (ya manejado por el .text() anterior)
                    throw new Error(errorBody || `Error ${response.status} al cargar paquetes.`);
                }
                
                // Parseamos a JSON SOLO si no hubo error de estatus
                const data = await response.json();
                setPaquetes(data);
                
            } catch (err) {
                console.error("Fetch Paquetes Error:", err);
                setError(err.message || "Error de conexión al servidor.");
            }
        };
        
        fetchPaquetes();
        
  }, [isLoggedIn, user]); // Dependencias: recargar si el estado de login cambia

  const list = filter === 'all'
    ? paquetes
    : paquetes.filter(p => p.categoria === filter);

  return (
    <main>
    <Container>
      <h2 className="mb-2">Travel Go</h2>
      <p className="text-muted mb-3">Viajes por todo Chile</p>
            
            {/* Mostrar alerta de error */}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* Mostrar filtros y productos solo si no hay error y hay paquetes */}
            {!error && (
                <>
                    <Filters
                    current={filter}
                    onChange={setFilter}
                    options={["1 a 2 horas", "3 a 8 horas", "13 a 24 horas", "mas de 24 horas"]}
                    total={paquetes.length}
                    />
                    <ProductGrid items={list} onAdd={addToCart} />
                </>
            )}

    </Container>
    </main>
  );
}