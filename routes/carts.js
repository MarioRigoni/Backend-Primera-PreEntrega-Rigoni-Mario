const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: `Carrito con ID ${req.params.cid} no encontrado` });
        }
        res.render('cartDetails', { cart: cart.toObject(), title: 'Carrito de Compras' });
    } catch (error) {
        console.error('Error al buscar el carrito:', error.message);
        res.status(500).json({ error: 'Error al buscar el carrito' });
    }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).send(`Carrito con ID ${req.params.cid} no encontrado`);
        }

        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).send(`Producto con ID ${req.params.pid} no encontrado`);
        }

        const productInCart = cart.products.find((p) => p.product.equals(req.params.pid));
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.redirect(`/carts/${req.params.cid}`); // Redirigir al carrito actualizado
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).send('Error al agregar producto al carrito');
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).send(`Carrito con ID ${req.params.cid} no encontrado`);
        }

        cart.products = cart.products.filter((p) => !p.product.equals(req.params.pid));
        await cart.save();
        res.redirect(`/carts/${req.params.cid}`);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error.message);
        res.status(500).send('Error al eliminar producto del carrito');
    }
});

// Ruta para vaciar el carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).send(`Carrito con ID ${req.params.cid} no encontrado`);
        }

        cart.products = [];
        await cart.save();
        res.redirect(`/carts/${req.params.cid}`);
    } catch (error) {
        console.error('Error al vaciar el carrito:', error.message);
        res.status(500).send('Error al vaciar el carrito');
    }
});

module.exports = router;
