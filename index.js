module.exports = () => {
  // ...
};

const fs = require('fs')
const modulePath = require('path')
const axios = require('axios')

//Función MDLinks
const mdLinks = (path, options) => {
  return checkingValidPath(path)  
  .then((links) => {
      if(options) {
        return consultHttp(links)
      }
        console.log(links)
        return links
    }).catch((err) => console.log('Aqui el catch de mdLinks:', err))
}


// Comprueba si la ruta es valida. Se usa el método 'fs.stat' de node.js
const checkingValidPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) { // Si hay un error con la ruta, se rechaza la promesa y muestra mensaje al usuario
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
            const test = modulePath.resolve(filePath); // se valida la ruta absoluta del archivo
            const pathAdsolute = test + '\\' + filePath;// se une la ruta absoluta con el nombre del archivo
            resolve(readPath(filePath)); // Se resuelve la promesa con la lectura el archivo encontrado
        } else  { // Se rechaza la promesa y se informa al usuario el tipo de extensión del archivo y que no podrá ser procesado
            reject(console.log('Este archivo es', modulePath.extname(filePath), 'no podemos procesarlo'))
        }
    })
}

// Comprueba los archivos dentro de un directorio, se usa el método 'fs.readdir'
const searchTheDirectory = (path) => {
   return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => { // Entra en el directorio  
            if (err) { // si hay un error se rechaza la promesa y se imprime el error en consola
                reject(console.log('Este directorio presenta una error:', err.message));
            } else { // recorre los archivos dentro del directorio, buscando los que tengan extensión .md
                files.map(file => {
                    if(modulePath.extname(file) === '.md') {
                        const test = modulePath.resolve(path); // se valida la ruta absoluta del archivo
                        const pathAdsolute = test + '\\' + file;// se une la ruta absoluta con el nombre del archivo
                        resolve(readPath(pathAdsolute)); // Se resuelve la promesa con la lectura el archivo encontrado
                    } else {// si existe un archivo que no sea .md se rechaza la promesa y se imprime en consola mensaje para el usuario.
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
            if(err) { // Si hay un error con la ruta, se rechaza de la promesa
                reject(console.log('No se pudo leer la ruta, por favor verifique.', err.message))
            } else {
                const hrefMd = /\[([^\[]+)\](\(.*\))/gm // expresión regular para encontrar los links y sus textos
                const hrefLinks = data.match(hrefMd) // obtenemos las coincidencias con la expresión regular dentro de la cadena.
                const singleMatch = /\[([^\[]+)\]\((.*)\)/  
                // recorro cada links encontrado en hrefLinks
                const links = hrefLinks.map(links => {
                    const text = singleMatch.exec(links) // Busqueda sobre las coincidencias con expresión regular
                    const link = { // Creo mi objeto de arrays
                        href: text[2],
                        text: text[1],
                        file: path
                    }
                    return link
                })
                resolve(links) // se resuelve la promesa mostrando en consola mi array con objetos
            }   
        })
    })
}

// Función para realizar la consulta http. Usando Axios
const consultHttp = (arr) => {
  arr.map(element => {
        const myElement = element.href
        axios.get(myElement)
        .then((response) => {
            const status = response.status;
            const ok = response.statusText;
            const https = {
                href: element.href,
                text: element.text,
                file: element.file,
                status: status,
                ok: ok
            }
            console.log(https)
            return https
        }) .catch((err) => {
            const response = err.response;
            const status = response.status;
            if(status >= 400) {
                const https = {
                    href: element.href,
                    text: element.text,
                    file: element.file,
                    status: 404,
                    ok: 'Fail'
                }
                console.log(https)

            }
        })  
    })
}


// Rutas de prueba: './Modulos/' --- 'README.md'
mdLinks('./Modulos/prueba.md', {validate: true})
