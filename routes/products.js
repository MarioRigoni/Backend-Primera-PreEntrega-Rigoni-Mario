const express = require('express'); // Importa Express
const router = express.Router(); // Configura el router
const fs = require('fs').promises; // Importa File System con promesas
const path = require('path'); // Importa Path para trabajar con rutas

const productosPath = path.join(__dirname, '../data/productos.json'); // Ruta al archivo JSON

// Ruta para listar todos los productos
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(productosPath, 'utf-8'); 
        const productos = JSON.parse(data); // Convierte el JSON a un array
        res.json(productos); // Devuelve los productos
    } catch (error) {
        console.error('Error al leer productos:', error.message);
        res.status(500).json({ error: 'Error al leer productos' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const data = await fs.readFile(productosPath, 'utf-8'); 
        const productos = JSON.parse(data); 

        const productId = req.params.pid; // Obtén el ID del producto de los parámetros
        const producto = productos.find((p) => p.id === productId); 
        if (!producto) {

            // Si no se encuentra, devuelve un error 404
            return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
        }

        res.json(producto); // Devuelve el producto encontrado
    } catch (error) {
        console.error('Error al buscar el producto:', error.message);
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const data = await fs.readFile(productosPath, 'utf-8'); 
        const productos = JSON.parse(data); 

        // Crear un nuevo producto desde el cuerpo de la solicitud
        const newProduct = {
            id: String(Date.now()), // Genera un ID único basado en el tiempo
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status ?? true, 
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || [] 
        };

        // Validar campos obligatorios
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
        }

        // Validar que el código no esté duplicado
        const existingProduct = productos.find((p) => p.code === newProduct.code);
        if (existingProduct) {
            return res.status(400).json({ error: 'El código ya existe' });
        }

        productos.push(newProduct); // Agrega el nuevo producto al array
        await fs.writeFile(productosPath, JSON.stringify(productos, null, 2)); 

        res.status(201).json(newProduct); // Devuelve el producto creado
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const data = await fs.readFile(productosPath, 'utf-8'); 
        const productos = JSON.parse(data); 

        const productId = req.params.pid; // Obtén el ID del producto de los parámetros
        const productIndex = productos.findIndex((p) => p.id === productId); // Encuentra el índice del producto

        if (productIndex === -1) {
            // Si no se encuentra el producto, devuelve un error 404
            return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
        }

        // Actualiza los campos del producto existente sin modificar su ID
        const updatedProduct = {
            ...productos[productIndex],
            ...req.body, 
            id: productos[productIndex].id // Asegura que el ID no se modifique
        };

        productos[productIndex] = updatedProduct; // Actualiza el producto en el array

        await fs.writeFile(productosPath, JSON.stringify(productos, null, 2)); 

        res.json(updatedProduct); // Devuelve el producto actualizado
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const data = await fs.readFile(productosPath, 'utf-8'); 
        const productos = JSON.parse(data); 

        const productId = req.params.pid; // Obtén el ID del producto de los parámetros
        const productIndex = productos.findIndex((p) => p.id === productId); // Encuentra el índice del producto

        if (productIndex === -1) {
            // Si no se encuentra el producto, devuelve un error 404
            return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
        }

        // Elimina el producto del array
        productos.splice(productIndex, 1);

        // Guarda los cambios en el archivo JSON
        await fs.writeFile(productosPath, JSON.stringify(productos, null, 2));

        res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router; // Exporta el router
