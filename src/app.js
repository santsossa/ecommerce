const express = require('express');
const app= express();
const router= require('./routes');

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('hola me llamo santiago')
})


app.use('/api', router);
module.exports= app;

