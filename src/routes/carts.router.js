const express = require('express');
const router= express.Router();
const {read_file, write_file}= require('../services/fs');

router.post('/', async (req,res)=>{
    const { products }= req.body;
    const new_cart={
        id:null,
        products,
    };
    try{
        const data_carts= await read_file('carts.json');
        if (data_carts) {
            const id = data_carts.length ? data_carts[data_carts.length - 1].id + 1 : 1;
            new_cart.id = id;
            data_carts.push(new_cart);        
            await write_file('carts.json', JSON.stringify(data_carts, null, 2));
            res.status(201).json({ message: 'nuevo carrito creado', new_cart });
        }
    }catch(error){
        console.error('Error al agregar un carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito'});
    }
})

router.get('/:cid', async (req,res)=>{
    const cart_id = parseInt(req.params.cid, 10);
    const data_carts= await read_file('carts.json');
    const cart_item = data_carts.find(p => p.id === cart_id);
    if (cart_item) {
        res.json(cart_item);
    }else {
        res.status(404).json({ message: 'carrito no encontrado' });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const product_id = parseInt(req.params.pid, 10);
    const cart_id = parseInt(req.params.cid, 10);
    try {
        const data_carts = await read_file('carts.json');
        const data_products = await read_file('products.json');
        const cart_item = data_carts.find(c => c.id === cart_id);
        const product = data_products.find(p => p.id === product_id);
        if (!cart_item) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const productInCart = cart_item.products.find(p => p.product_id === product_id);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart_item.products.push({ product_id, quantity: 1 });
        }
        await write_file('carts.json', JSON.stringify(data_carts, null, 2));
        res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart: cart_item });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito' });
    }
});


module.exports= router;