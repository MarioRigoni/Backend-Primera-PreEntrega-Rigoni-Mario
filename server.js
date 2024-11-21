const express = require('express');
const app = express();

const productRoutes = require('./routes/products'); // Rutas de productos
const cartRoutes = require('./routes/carts'); // Rutas de carritos

app.use(express.json()); // Middleware para procesar JSON

// Usa las rutas en los endpoints correspondientes
app.use('/api/products', productRoutes); // Endpoints para productos
app.use('/api/carts', cartRoutes); // Endpoints para carritos

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

