const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Rutas de productos
router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
