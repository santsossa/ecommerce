const Product = require('../models/products.models');

exports.getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        
        limit = isNaN(limit) || limit <= 0 ? 10 : parseInt(limit, 10);
        page = isNaN(page) || page <= 0 ? 1 : parseInt(page, 10);
        
        const filter = {};
        
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            filter.$or = [
                { category: { $regex: lowerCaseQuery, $options: 'i' } },
                { status: lowerCaseQuery === 'true' || lowerCaseQuery === 'false' ? lowerCaseQuery === 'true' : undefined }
            ].filter(Boolean);
        }

        const options = {
            limit,
            page,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true 
        };

        const products = await Product.paginate(filter, options);
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products;

        const baseUrl = `/products?limit=${limit}`;
        const queryPart = query ? `&query=${query}` : '';
        const sortPart = sort ? `&sort=${sort}` : '';

        res.render('products', {
            products: docs,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `${baseUrl}&page=${prevPage}${queryPart}${sortPart}` : null,
            nextLink: hasNextPage ? `${baseUrl}&page=${nextPage}${queryPart}${sortPart}` : null
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean(); 
        if (product) {
            res.render('productDetails', { product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Producto agregado con éxito', product: savedProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true }).lean();
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid).lean();
        if (deletedProduct) {
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};
