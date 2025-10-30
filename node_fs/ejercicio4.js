import * as fs from 'fs/promises';

async function main() {
    
    const nombreArchivo = process.argv[2];
    const palabraBuscada = process.argv[3];

    try {
        console.log(`Buscando la palabra "${palabraBuscada}" en el archivo "${nombreArchivo}"...`);
        
        const contenido = await fs.readFile(nombreArchivo, 'utf8');

        // 4. Contar las apariciones de la palabra
        // Escapamos la palabra para que no interfiera con la sintaxis de la expresión regular.
        const palabraLimpia = palabraBuscada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        
        // Creamos la expresión regular:
        // - \b: Delimitador de palabra (asegura que solo se cuenten palabras completas).
        // - g: Global (busca todas las ocurrencias).
        // - i: Insensible a mayúsculas/minúsculas.
        const regex = new RegExp(`\\b${palabraLimpia}\\b`, 'gi');
        
        // El método match() devuelve un array de coincidencias o null.
        const coincidencias = contenido.match(regex);
        
        const conteo = coincidencias ? coincidencias.length : 0;

        console.log(`\nLa palabra "${palabraBuscada}" aparece ${conteo} veces en el archivo "${nombreArchivo}".`);

    } catch (error) {
        
        return console.error(error.message);
    }
}

main();