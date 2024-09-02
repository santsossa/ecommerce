const express = require('express');
const app= express();
const router= require('./routes');
const handlebars= require('express-handlebars');
const path = require('path');


app.use(express.json());
app.engine("handlebars", handlebars.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.set("views",path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.use('/api', router);
module.exports= app;

