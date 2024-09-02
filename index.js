const app= require('./src/app');
const PORT=8080;


app.listen(PORT, ()=>{
    console.log(`listening in port ${PORT} at http://localhost:${PORT}`)
});

