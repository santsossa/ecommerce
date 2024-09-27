const Cart = require('../models/carts.models');
const Product = require('../models/products.models');

// Crear un nuevo carrito
const createCart = async (req, res) => {
    const { products } = req.body;
    const new_cart = new Cart({ products });

    try {
        const saved_cart = await new_cart.save();
        res.status(201).json({ message: 'Nuevo carrito creado', cart: saved_cart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
};

// Obtener un carrito por ID
const getCartById = async (req, res) => {
    const cart_id = req.params.cid;
    try {
        const cart_item = await Cart.findById(cart_id).populate('products.product_id').lean();

        if (cart_item) {
            res.render('cart', { cart: cart_item });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Agregar producto al carrito
const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        const product = await Product.findById(pid).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const productInCart = cart_item.products.find(p => p.product_id.toString() === pid);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart_item.products.push({ product_id: pid, quantity: 1 });
        }

        const updated_cart = await cart_item.save();
        res.status(201).json({ success: true, message: 'Producto agregado al carrito con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el producto al carrito' });
    }
};

// Eliminar producto del carrito
const removeProductFromCart = async (req, res) => {
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
};

// Actualizar carrito
const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'El array de productos no es válido' });
    }

    for (const product of products) {
        if (!product.product_id || !product.quantity) {
            return res.status(400).json({ message: 'Cada producto debe tener un product_id y quantity' });
        }
    }

    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart_item.products = products;
        const updated_cart = await cart_item.save();

        res.status(200).json({ message: 'Carrito actualizado con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
};

// Actualizar cantidad de un producto en el carrito
const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
    }

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
};

// Eliminar todos los productos del carrito
const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart_item = await Cart.findById(cid);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart_item.products = [];
        const updated_cart = await cart_item.save();

        res.status(200).json({ message: 'Todos los productos eliminados del carrito con éxito', cart: updated_cart });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar todos los productos del carrito' });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart
};
