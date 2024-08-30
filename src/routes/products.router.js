const express = require('express');
const router= express.Router();
const {read_file, write_file}= require('../services/fs');

router.get('/', async (req,res)=>{
    const data_products = await read_file('products.json');
    if (data_products) {
        res.json(data_products);
    } else {
        res.status(500).json({ message: 'Error al leer los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const data_products = await read_file('products.json')
    if (data_products) {
        const productId = parseInt(req.params.pid, 10);
        const product = data_products.find(p => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } else {
        res.status(500).json({ message: 'Error al leer los productos' });
    }
});

router.post('/', async (req, res)=>{
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = {
        id : null,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      };
    try {
        const data_products = await read_file('products.json');
        if (data_products) {
            const id= data_products.length ? data_products[data_products.length - 1].id + 1 : 1;
            newProduct.id = id;
            data_products.push(newProduct);
            await write_file('products.json', JSON.stringify(data_products, null, 2));
            res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
        } else {
            res.status(500).json({ message: 'Error al leer los productos' });
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
});
router.put('/:pid', async (req,res)=>{
    const {pid}  = req.params;
    try {
        const data_products = await read_file('products.json');
        if (data_products) {
            const productIndex = data_products.findIndex(product => product.id === parseInt(pid));            
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            const updatedProduct = req.body;
            data_products[productIndex] = {
                ...data_products[productIndex], 
                ...updatedProduct,        
                id: data_products[productIndex].id 
            };
            await write_file('products.json', JSON.stringify(data_products, null, 2));
            res.json({ message: 'Producto actualizado con éxito', data_products: data_products[productIndex] });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});
router.delete('/:pid', async (req,res)=>{
    const {pid}  = req.params;
    try {
        const data_products = await read_file('products.json');
        if (data_products) {
            const productIndex = data_products.findIndex(product => product.id === parseInt(pid));            
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }else{
                data_products.splice(productIndex, 1);
            }
            await write_file('products.json', JSON.stringify(data_products, null, 2));
            return res.json({ message: 'Producto eliminado con éxito'});
        }
    }catch{}    
})












router.delete('/:pid', (req,res)=>{
    const {pid}  = req.params;
    const productIndex = products.findIndex(product => product.id === parseInt(pid));
    if (products[productIndex]===-1){
        return res.json({ message: 'Producto no encontrado '});
    }else{
        products.splice(productIndex, 1);
    }
    
})


module.exports= router;


