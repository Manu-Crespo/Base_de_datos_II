import * as fs from 'fs/promises';
import { setTimeout } from 'timers/promises';

const FILE_NAME_OLD = 'datos.txt';
const FILE_NAME_NEW = 'informacion.txt';
const DELAY_MS = 10000;

function obtenerFechaHoraFormateada() {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function obtenerContenidoInicial() {
    
    const nombre = "Manu Crespo"; 
    const edad = "25";
    const carrera = "Tecnicatura Universitaria en Programación";

    return `Nombre: ${nombre}\nEdad: ${edad}\nCarrera: ${carrera}\n`;
}


async function main() {
    try {
        
        console.log(`\n1. Creando ${FILE_NAME_OLD}...`);
        const contenido = obtenerContenidoInicial();
        // writeFile sobrescribe si el archivo existe o lo crea si no existe
        await fs.writeFile(FILE_NAME_OLD, contenido, 'utf8');
        console.log(`Archivo ${FILE_NAME_OLD} creado con éxito.`);
        
        console.log(`\n2. Leyendo el contenido de ${FILE_NAME_OLD}:`);
        
        const contenidoLeido = await fs.readFile(FILE_NAME_OLD, 'utf8');
        console.log("-----------------------------------------");
        console.log(contenidoLeido.trim());
        console.log("-----------------------------------------");
        
        const fechaHora = obtenerFechaHoraFormateada();
        const contenidoExtra = `Fecha de modificación: ${fechaHora}\n`;
        
        await fs.appendFile(FILE_NAME_OLD, contenidoExtra, 'utf8');
        console.log(`Fecha agregada: ${contenidoExtra.trim()}`);
        
        console.log(`\n4. Renombrando ${FILE_NAME_OLD} a ${FILE_NAME_NEW}...`);
        await fs.rename(FILE_NAME_OLD, FILE_NAME_NEW);
        console.log(`Archivo renombrado a ${FILE_NAME_NEW}.`);

        await setTimeout(DELAY_MS);
        
        // unlink elimina el archivo
        await fs.unlink(FILE_NAME_NEW);
        console.log(`\nArchivo ${FILE_NAME_NEW} eliminado con éxito.`);

    } catch (error) {
        console.error('\n', error.message);
    } finally {
        console.log('\n--- Proceso finalizado ---');
    }
}

main();