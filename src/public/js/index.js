const socket = io();

socket.on("products", (products)=>{
    const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('li');

            productItem.innerHTML = `
                <h3>${product.title}</h3>
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Code:</strong> ${product.code}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Status:</strong> ${product.status ? 'Available' : 'Out of Stock'}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <button class="deletebtn" data-id="${product.id}">Delete</button>            `;
            productList.appendChild(productItem);
        });
        document.querySelectorAll('.deletebtn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                deleteProduct(productId);
            });
        });
})
function deleteProduct(productId) {
    console.log('Deleting product with ID:', productId);
    socket.emit('deleteProduct', productId);
}
document.getElementById('addProductForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        status: document.getElementById('status').checked,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };

    socket.emit('addProduct', newProduct);
})
