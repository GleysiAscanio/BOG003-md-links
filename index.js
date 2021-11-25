module.exports = () => {
  // ...
};

const fs = require('fs');
const modulePath = require('path');

//Función MDLinks
const mdLinks = (path) => {
  return new Promise((resolve, reject) => {
    resolve(checkingValidPath(path));
  })
}


// Comprueba si la ruta es valida. Se usa el método 'fs.stat' de node.js
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

mdLinks('./Modulos/')
    .then(() => console.log('Proceso Exitoso!!!'))
    .catch(err => console.error('Por favor, verifique'));

// Comprueba si el archivo es un '.md' se usa el método 'path.extname'
const verifyingTypePath = (filePath) => {
    return new Promise((resolve, reject) => {
        if (modulePath.extname(filePath) === '.md') { //Comprueba que la extensión de la ruta es '.md'
            resolve(console.log('Este archivo es', modulePath.extname(filePath)));
        } else  { // Informa al usuario el tipo de extensión del archivo y que no podrá ser procesado
            reject(console.log('Este archivo es', modulePath.extname(filePath), 'no podemos procesarlo'))
        }
    })
}

// Comprueba los archivos dentro de un directorio
const searchTheDirectory = (path) => {
    return new Promise((resolve, reject) => {
      // creo una variable con un array vacío
      let found = [];
        fs.readdir(path, (err, files) => { // Entra en el directorio  
            if (err) { // si hay un error se imprime el error en consola
                reject(console.log('Este directorio posee un error', err.message));
            } else { // recorre los archivos dentro del directorio, buscando los que tengan extensión .md
                files.forEach(file => {
                    if (modulePath.extname(file) === '.md') {
                        // obtengo la ruta absoluta de los archivos y llamo la función que los lee.
                      const test = modulePath.resolve(path);
                      const pathAdsoluta = test + '\\' + file;
                      readPath(pathAdsoluta)
                      found.push(file); // lleno mi array con cada archivo .md que va encontrando mi forEach
                    }
                  })
                  //Por el momento imprimo en consola mi arreglo de archivos encontrados
                  resolve(console.log("En este directorio hay:", found));
            }
        })
    })
}

// Función que lee los archivos encontrados
const readPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'UTF8', (err, data) => {
            if(err) {
                reject(console.log('No se pudo leer la ruta, por favor verifique.', err.message))
            }
            resolve(console.log( path, data))
        })
    })
}



