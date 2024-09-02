const app= require('./src/app');
const setupSocket = require('./src/services/socket.io');
const PORT=8080;


const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

setupSocket(server);