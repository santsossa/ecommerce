const {read_file, write_file}= require('./fs');
const { Server } = require('socket.io');

function setupSocket(server) {
    const io = new Server(server);

    io.on('connection', async (socket) => {
        console.log('New user connected:', socket.id);

        try {
            const data_products = await read_file('products.json');
            socket.emit('products', data_products);
        } catch (err) {
            console.error('Error fetching products:', err);
        }

        socket.on('deleteProduct', async (productId) => {
            const pid = parseInt(productId);
            try {
                let data_products = await read_file('products.json');
                const productIndex = data_products.findIndex(product => product.id === pid);

                if (productIndex === -1) {
                    socket.emit('error', { message: 'Producto no encontrado' });
                    return;
                }

                data_products.splice(productIndex, 1);
                await write_file('products.json', JSON.stringify(data_products, null, 2));
                io.emit('products', data_products);
            } catch (error) {
                console.error('Error deleting product:', error);
                socket.emit('error', { message: 'Error al eliminar el producto' });
            }
        });

        socket.on('addProduct', async (newProductClient) => {
            const { title, description, code, price, status, stock, category, thumbnails } = newProductClient;
            const newProduct = {
                id: null,
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
                let data_products = await read_file('products.json');
                const id = data_products.length ? data_products[data_products.length - 1].id + 1 : 1;
                newProduct.id = id;
                data_products.push(newProduct);
                await write_file('products.json', JSON.stringify(data_products, null, 2));
                io.emit('products', data_products);
            } catch (error) {
                console.error('Error adding product:', error);
                socket.emit('error', { message: 'Error al agregar el producto' });
            }
        });
    });

    return io;
}

module.exports = setupSocket;