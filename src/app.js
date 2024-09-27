const express = require('express');
const app= express();
const router= require('./routes');
const handlebars= require('express-handlebars');
const path = require('path');
const mongoose= require('mongoose');
const dotenv= require('dotenv');


dotenv.config();



app.use(express.json());
app.engine("handlebars", handlebars.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.set("views",path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('conectado a mongodb atlas');
}).catch((error)=>{
    console.error('error conectando a MongoDB Atlas:' ,error)
})

app.use(router);
module.exports= app;

