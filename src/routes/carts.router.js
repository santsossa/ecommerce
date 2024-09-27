const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Crear un nuevo carrito
router.post('/', cartController.createCart);

// Obtener carrito por ID
router.get('/:cid', cartController.getCartById);

// Agregar producto al carrito
router.post('/:cid/product/:pid', cartController.addProductToCart);

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);

// Actualizar carrito
router.put('/:cid', cartController.updateCart);

// Actualizar cantidad de producto en carrito
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete('/:cid', cartController.clearCart);

module.exports = router;
