// src/data/Travel.mock.js
export const CATEGORIES = ['1 a 2 horas', '3 a 8 horas', '13 a 24 horas', 'mas de 24 horas'];

export const TRAVELING_DESTINATION = [
    {
        id: 1,
        name: 'Valparaíso',
        price: 699990,
        category: '1 a 2 horas',
        imageUrl: 'https://www.mhnv.gob.cl/sites/www.mhnv.gob.cl/files/2021-04/valparaiso-1-mpo2z5tez0o9jr4dke1y6aygrvyefe346e9gfoo48g.png',
        // se guarda esto con su key y todo :D, que inteligente q soy, ik ik
        itinerary: [
            { dia: 1, actividad: 'Llegada y paseo por los cerros Alegre y Concepción.' },
            { dia: 1, actividad: 'Almuerzo en el Mercado Puerto.' },
            { dia: 1, actividad: 'Recorrido en Ascensor El Peral y cena con vista al mar.' },
            { dia: 2, actividad: 'Hola soy un test del dia 2 :D'}
        ]
    },
    {
        id: 2,
        name: 'Concón',
        price: 659990,
        category: '1 a 2 horas',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Dunas_De_Conc%C3%B3n_%2840046667682%29.jpg'
    },
    {
        id: 3,
        name: 'Rancagua',
        price: 399990,
        category: '1 a 2 horas',
        imageUrl: 'https://images.visitchile.com/destinos/574_Rancagua.jpg?w=960&h=448&fit=crop&q=auto&auto=format'
    },
    {
        id: 4,
        name: 'Talca',
        price: 59990,
        category: '3 a 8 horas',
        imageUrl: 'https://blog.uber-cdn.com/cdn-cgi/image/width=2160,quality=80,onerror=redirect,format=auto/wp-content/uploads/2018/05/Descubre-todo-lo-que-puedes-hacer-en-Talca-en-so%CC%81lo-dos-di%CC%81as.jpg'
    },
    {
        id: 5,
        name: 'Concepción',
        price: 79990,
        category: '3 a 8 horas',
        imageUrl: 'https://images.visitchile.com/destinos/4296_Concepcion.jpg?w=960&h=448&fit=crop&q=auto&auto=format'
    },
    {
        id: 6,
        name: 'Puerto Montt',
        price: 49990,
        category: '13 a 24 horas',
        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/41/18/29/caption.jpg?w=1200&h=-1&s=1'
    },
    {
        id: 7,
        name: 'Chiloé',
        price: 899990,
        category: '13 a 24 horas',
        imageUrl: 'https://www.skorpios.cl/wp-content/uploads/Isla-de-Chilo%C3%A9.jpg'
    },
    {
        id: 8,
        name: 'Arica',
        price: 129990,
        category: 'mas de 24 horas',
        imageUrl: 'https://blog.uber-cdn.com/cdn-cgi/image/width=2160,quality=80,onerror=redirect,format=auto/wp-content/uploads/2018/04/5-panoramas-en-Arica-que-no-te-puedes-perder-1024x512.png'
    }
];
