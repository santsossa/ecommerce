const express= require("express");
const router= express.Router();

const productsRouter= require("./products.router");
const cartsRouter= require("./carts.router");
const realtimeproducts= require("./realtimepr.router")

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/realtimeproducts', realtimeproducts);

module.exports= router;