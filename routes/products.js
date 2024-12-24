const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importar el modelo de producto

// Ruta para listar todos los productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Construir filtro dinámico
        let filter = {};
        if (query) {
            filter = { 
                $or: [
                    { category: query }, 
                    { status: query.toLowerCase() === 'true' } // Convertir 'true' o 'false' a booleano
                ]
            };
        }

        // Configuración de opciones para paginación y ordenamiento
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
        };

        // Usar paginación de Mongoose
        const result = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.page - 1 : null,
            nextPage: result.hasNextPage ? result.page + 1 : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}` : null,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
});

module.exports = router;
