const express = require('express'); // Importa Express
const router = express.Router(); // Configura el router
const fs = require('fs').promises; // Importa File System con promesas
const path = require('path'); // Importa Path para trabajar con rutas

const carritosPath = path.join(__dirname, '../data/carrito.json'); 

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const data = await fs.readFile(carritosPath, 'utf-8'); 
        const carritos = JSON.parse(data); 

        // Crear un nuevo carrito
        const newCart = {
            id: String(Date.now()), // Genera un ID único basado en el tiempo
            products: [] 
        };

        carritos.push(newCart); // Agrega el nuevo carrito al array
        await fs.writeFile(carritosPath, JSON.stringify(carritos, null, 2)); 

        res.status(201).json(newCart); // Devuelve el carrito creado
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const data = await fs.readFile(carritosPath, 'utf-8'); 
        const carritos = JSON.parse(data); 

        const carritoId = req.params.cid; // Obtén el ID del carrito de los parámetros
        const carrito = carritos.find((c) => c.id === carritoId); // Busca el carrito por ID

        if (!carrito) {
            // Si no se encuentra el carrito, devuelve un error 404
            return res.status(404).json({ error: `Carrito con ID ${carritoId} no encontrado` });
        }

        res.json(carrito.products); // Devuelve los productos del carrito
    } catch (error) {
        console.error('Error al buscar el carrito:', error.message);
        res.status(500).json({ error: 'Error al buscar el carrito' });
    }
});

// Ruta para agregar un producto a un carrito por su ID
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carritoData = await fs.readFile(carritosPath, 'utf-8'); 
        const carritos = JSON.parse(carritoData); 
        const carritoId = req.params.cid; // ID del carrito
        const productId = req.params.pid; // ID del producto

        const carrito = carritos.find((c) => c.id === carritoId); // Busca el carrito por ID
        if (!carrito) {
            // Si no se encuentra el carrito, devuelve un error 404
            return res.status(404).json({ error: `Carrito con ID ${carritoId} no encontrado` });
        }

        // Busca el producto en el carrito
        const productInCart = carrito.products.find((p) => p.product === productId);

        if (productInCart) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            productInCart.quantity += 1;
        } else {
            // Si no está, lo agrega con cantidad 1
            carrito.products.push({ product: productId, quantity: 1 });
        }

        // Guarda los cambios en el archivo JSON
        await fs.writeFile(carritosPath, JSON.stringify(carritos, null, 2));

        res.status(200).json(carrito); // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router; // Exporta el router
