const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const connectDB = require('./db');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para lista de productos
app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { status: query }] };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
        };

        const result = await Product.paginate(filter, options);
        res.render('products', {
            title: 'Lista de Productos',
            products: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.hasPrevPage ? result.page - 1 : null,
            nextPage: result.hasNextPage ? result.page + 1 : null,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para detalles del producto
app.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        const cartId = await Cart.findOne(); // Obtener un carrito para pruebas
        res.render('productDetails', { ...product.toObject(), cartId: cartId._id });
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).send('Error al obtener el producto');
    }
});

// Puerto
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
