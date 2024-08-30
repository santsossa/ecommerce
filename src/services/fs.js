const fs = require('fs').promises;
const path = require('path');

async function read_file(file_name) {
    try {
        const file_path = path.join('src','data', file_name);
        const data = await fs.readFile(file_path, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
    }
}
async function write_file(file_name, data) {
    try {
        const file_path = path.join('src','data', file_name);
        await fs.writeFile(file_path, data, 'utf-8');
    } catch (error) {
        console.error('Error al escribir el archivo:', error);
    }
}


module.exports = { read_file, write_file };