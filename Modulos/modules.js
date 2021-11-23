const fs = require("fs");

//Comprueba si la ruta es valida. Se usa un modulo de node.js
const checkingValidPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                // Si hay un error con la ruta, se muestra mensaje y el tipo de error
                reject(console.log('La ruta ingresada no es valida, por favor verifique', err.message));
                /*console.log(`Is file: ${stats.isFile()}`);
                console.log(`Is directory: ${stats.isDirectory()}`);  */ 
            } else {
                /* Si no hay ningún error de resuelve la promesa. De momento se imprime en consola los stats 
                de la ruta */
                resolve(console.log(stats));
            }
        })
    })
    
}

checkingValidPath('README.md')
    .then(() => console.log('Todo salio bien'))
    .catch(err => console.error('Aqui el error', err));