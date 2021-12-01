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

// Comprueba si el archivo es un '.md' se usa el método 'path.extname'
const verifyingTypePath = (filePath) => {
    return new Promise((resolve, reject) => {
        if (modulePath.extname(filePath) === '.md') { //Comprueba que la extensión de el archivo es '.md'
            resolve(readPath(filePath));// Se resuelve la promesa con la lectura el archivo encontrado
        } else  { // Informa al usuario el tipo de extensión del archivo y que no podrá ser procesado
            reject(console.log('Este archivo es', modulePath.extname(filePath), 'no podemos procesarlo'))
        }
    })
}

// Comprueba los archivos dentro de un directorio, se usa el método 'fs.readdir'
const searchTheDirectory = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => { // Entra en el directorio  
            if (err) { // si hay un error se imprime el error en consola
                reject(console.log('Este directorio presenta una error:', err.message));
            } else { // recorre los archivos dentro del directorio, buscando los que tengan extensión .md
                let foundPaths = [];  // creo una variable con un array vacío, para ingresar los archivos .md encontrados
                files.forEach(file => { // recorro los archivos encontrados
                    if(modulePath.extname(file) === '.md') { // verifico los que sean extensión .md
                      const test = modulePath.resolve(path); // se valida la ruta absoluta del archivo
                      const pathAdsolute = test + '\\' + file;// se une la ruta absoluta con el nombre del archivo
                      foundPaths.push(pathAdsolute) // lleno mi array con los archivos .md encontrados
                      resolve(readPath(pathAdsolute)); // Se resuelve la promesa con la lectura el archivo encontrado
                    } else {// si existe un archivo que no sea .md se imprime en consola mensaje para el usuario.
                        reject(console.log('Este directorio contiene archivos:', file, 'que no pueden ser procesados'));
                    }
                })
            }
        })
    })
}

// Función que lee los archivos encontrados, se usa el método 'fs.readFile'
const readPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'UTF8', (err, data) => { // se lee la ruta recibida y se convierte.
            if(err) { // Si hay un error con la ruta, se hace reject de la promesa
                reject(console.log('No se pudo leer la ruta, por favor verifique.', err.message))
            } else {
                const hrefMd = /\[([^\[]+)\](\(.*\))/gm // expresión regular para encontrar los links y sus textos
                const hrefLinks = data.match(hrefMd) // obtenemos las coincidencias con la expresión regular dentro de la cadena.
                const singleMatch = /\[([^\[]+)\]\((.*)\)/  
                let foundLinks = [];  // creo una variable con un array vacío, para ingresar mis objetos
                    for(let i=0; i < hrefLinks.length; i++) { // creo un ciclo sobre cada link encontrado
                        const text = singleMatch.exec(hrefLinks[i]) // Busqueda sobre las coincidencias con expresión regular
                        foundLinks.push({ // Le hago un push de cada objeto a mi array foundLinks
                            href: text[2],
                            text: text[1],
                            file : path
                        })
                    }
                resolve(console.log(foundLinks)) // se resuelve la promesa mostrando en consola mi array con objetos
            }   
        })
    })
}

// './Modulos/' --- 'README.md'
mdLinks('./Modulos/prueba.md')
    .then(() => console.log('***Proceso exitoso***'))
    .catch(err => console.error('Por favor, verifique'));
