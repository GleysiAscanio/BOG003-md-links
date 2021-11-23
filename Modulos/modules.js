const fs = require('fs');
const path = require('path');

// Comprueba si la ruta es valida. Se usa el módulo 'stat' de node.js
const checkingValidPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) { // Si hay un error con la ruta, se muestra mensaje y el tipo de error
                reject(console.log('La ruta ingresada no es valida', err.message));
            } else if (stats.isDirectory() === true) { // Comprueba si la ruta es un directorio
                resolve(console.log('Esta ruta es un Directorio'));
            } else { // Se resuelve la promesa, comprobando que es un archivo '.md'
                resolve(verifyingTypePath(path));
            }
        })
    })
}

checkingValidPath('./README.md')
    .then(() => console.log('Todo salio bien'))
    .catch(err => console.error('Por favor, verifique'));


const verifyingTypePath = (filePath) => {
    return new Promise((resolve, reject) => {
        if (path.extname(filePath) === '.md') {
            resolve(console.log('Este archivo es', path.extname(filePath)));
        } else  {
            reject(console.log('Este archivo es', path.extname(filePath), 'no podemos procesarlo'))
        }
    })
}

// verifyingTypePath('README.md');


// usar Promise.all para ejecutar todas las promesas en orden y obtener las respuestas de cada una.
