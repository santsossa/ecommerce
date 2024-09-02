const express = require('express');
const router= express.Router();
const {read_file, write_file}= require('../services/fs');

router.get("/", async (req,res)=>{
    try {
        const data_products = await read_file('products.json');
        res.render('index', { 
            showRealTime: true,
            products: data_products
        });
    } catch (error) {
        res.status(500).send('Error reading products');
    }
});

module.exports = router;

