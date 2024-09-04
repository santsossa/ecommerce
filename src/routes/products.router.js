const express = require('express');
const router = express.Router();
const Product = require('../models/products.models');

// Ruta para obtener productos con paginación, filtros y ordenamientos
router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit, 10);
        page = parseInt(page, 10);

        const filter = {};
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            filter.$or = [
                { category: { $regex: lowerCaseQuery, $options: 'i' } },
                { status: lowerCaseQuery === 'true' }
            ];
        }

        const options = {
            limit,
            page,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const products = await Product.paginate(filter, options);
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products;

        res.render('products', {
            products: docs,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.render('productDetails', { product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Producto agregado con éxito', product: savedProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (deletedProduct) {
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});

module.exports = router;