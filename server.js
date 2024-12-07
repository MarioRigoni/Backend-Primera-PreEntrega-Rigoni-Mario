const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http'); // Para crear un servidor compatible con socket.io
const { Server } = require('socket.io'); // Importa socket.io
const fs = require('fs');

// Crea la aplicación Express

const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server); // Vincular socket.io al servidor HTTP

// Configura Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos para las vistas
app.use(express.static(path.join(__dirname, 'public')));

// Rutas existentes (productos y carritos)
const productRoutes = require('./routes/products'); // Rutas de productos
const cartRoutes = require('./routes/carts'); // Rutas de carritos

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para Home
app.get('/', (req, res) => {
  res.render('home', { title: 'Bienvenido al servidor con Handlebars' });
});

// Ruta para Real-Time Products
app.get('/realtimeproducts', (req, res) => {
  // Leer productos actuales del archivo
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf8'));
  res.render('realTimeProducts', { title: 'Productos en tiempo real', products });
});

// WebSocket: Manejo de eventos
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Evento para agregar producto
  socket.on('addProduct', (product) => {
    const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf8'));

    // Crear un nuevo producto con ID único
    const newProduct = {
      id: Date.now().toString(),
      title: product.title,
      price: product.price,
      stock: product.stock,
    };

    // Agregar producto al arreglo y guardar en archivo
    products.push(newProduct);
    fs.writeFileSync('./data/productos.json', JSON.stringify(products, null, 2));

    // Emitir lista actualizada a todos los clientes
    io.emit('updateProducts', products);
  });

  // Evento para eliminar producto
  socket.on('deleteProduct', (id) => {
    let products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf8'));

    // Filtrar producto por ID y guardar en archivo
    products = products.filter((product) => product.id !== id);
    fs.writeFileSync('./data/productos.json', JSON.stringify(products, null, 2));

    // Emitir lista actualizada a todos los clientes
    io.emit('updateProducts', products);
  });
});

// Puerto de escucha
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


