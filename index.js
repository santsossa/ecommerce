const app= require('./src/app');
const { Server }= require("socket.io");
const {read_file, write_file}= require('./src/services/fs');
const PORT=8080;

app.get("/realtimeproducts", async (req,res)=>{
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
const server= app.listen(PORT, ()=>{
    console.log(`servidor escuchando en http://localhost:${PORT}`);
})

const io= new Server (server);

io.on('connection', async (socket) => {
    console.log('New user connected:', socket.id);
    try {
        const data_products = await read_file('products.json');
        socket.emit("products", data_products);
    } catch (err) {
        console.log(err);
    }
    socket.on('deleteProduct', async(productId)=>{
        const pid  = productId;
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
    socket.on('addProduct', async (newProductClient)=>{
        const { title, description, code, price, status, stock, category, thumbnails } = newProductClient;
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
    })
});