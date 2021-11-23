const fs = require('fs');
const path = require('path');

// Comprueba si la ruta es valida. Se usa el método 'stat' de node.js
const checkingValidPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) { // Si hay un error con la ruta, se muestra mensaje y el tipo de error
                reject(console.log('La ruta ingresada no es valida', err.message));
            } else if (stats.isDirectory() === true) { // Comprueba si la ruta es un directorio
                resolve(searchTheDirectory(path));
            } else { // Se resuelve la promesa, comprobando que es un archivo '.md'
                resolve(verifyingTypePath(path));
            }
        })
    })
}

checkingValidPath('./Modulos/')
    .then(() => console.log('Proceso Exitoso!!!'))
    .catch(err => console.error('Por favor, verifique'));

// Comprueba si el archivo es un '.md' se usa el método 'path.extname'
const verifyingTypePath = (filePath) => {
    return new Promise((resolve, reject) => {
        if (path.extname(filePath) === '.md') { //Comprueba que la extensión de la ruta es '.md'
            resolve(console.log('Este archivo es', path.extname(filePath)));
        } else  { // Informa al usuario el tipo de extensión del archivo y que no podrá ser procesado
            reject(console.log('Este archivo es', path.extname(filePath), 'no podemos procesarlo'))
        }
    })
}

// Comprueba los archivos dentro de un directorio
const searchTheDirectory = (directoryPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(console.log('Este directorio No posee un archivo .md', err.message));
            } else {
                files.forEach(file => {
                    if (path.extname(file) === '.md')
                      resolve(console.log("En este directorio hay:", file));
                  })
            }
        })
    })
}
