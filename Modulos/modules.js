const fs = require("fs");

// Comprueba si la ruta es valida. Se usa el módulo 'stat' de node.js
const checkingValidPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) { // Si hay un error con la ruta, se muestra mensaje y el tipo de error
                reject(console.log('La ruta ingresada no es valida, por favor verifique', err.message));
            } else if (stats.isDirectory() === true) { // Comprueba si la ruta es un directorio
                resolve(console.log('Esta ruta es un Directorio'));
            } else { // Se resuelve la promesa, comprobando que es un archivo.
                resolve(console.log('Esta ruta es un Archivo'));
            }
        })
    })
}
checkingValidPath('./README.md')
    .then(() => console.log('Todo salio bien'))
    .catch(err => console.error('Aqui el error', err));


const verifyingTypePath = (path) => {

        console.log(`Is file: ${stats.isFile()}`);
        console.log(`Is directory: ${stats.isDirectory()}`);
}

// verifyingTypePath('README.md');


// usar Promise.all para ejecutar todas las promesas en orden y obtener las respuestas de cada una.
