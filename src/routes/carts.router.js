const express = require('express');
const router = express.Router();
const Cart = require('../models/carts.models');
const Product = require('../models/products.models');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const { products } = req.body;
    const new_cart = new Cart({
        products,
    });
    try {
        const saved_cart = await new_cart.save();
        res.status(201).json({ message: 'Nuevo carrito creado', cart: saved_cart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});

// Obtener un carrito por ID con productos completos (populate)
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product_id');
        if (cart) {
            res.render('cart', { products: cart.products });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error.message);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart_item = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar la estructura del carrito
        console.log('Cart Item:', cart_item);
        const productInCart = cart_item.products.find(p => p.product_id.toString() === pid);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart_item.products.push({ product_id: pid, quantity: 1 });
        }

        const updated_cart = await cart_item.save();
        console.log('Updated Cart:', updated_cart);

        res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito' });
    }
});


// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart_item.products = cart_item.products.filter(p => p.product_id.toString() !== pid);
        const updated_cart = await cart_item.save();
        res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart_item.products = products; // Actualiza todos los productos
        const updated_cart = await cart_item.save();
        res.status(200).json({ message: 'Carrito actualizado con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
});

// Actualizar solo la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const productInCart = cart_item.products.find(p => p.product_id.toString() === pid);
        if (!productInCart) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        productInCart.quantity = quantity;
        const updated_cart = await cart_item.save();
        res.status(200).json({ message: 'Cantidad del producto actualizada con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart_item.products = []; // Vacía todos los productos del carrito
        const updated_cart = await cart_item.save();
        res.status(200).json({ message: 'Todos los productos eliminados del carrito con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar todos los productos del carrito' });
    }
});

module.exports = router;
