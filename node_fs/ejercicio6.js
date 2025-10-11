import * as fs from 'fs/promises';

const LOG_DIR = 'logs';
const LOG_FILE = `${LOG_DIR}/app.log`;

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

async function registrarEjecucion() {
    try {
        // Asegura que el directorio 'logs' exista. 
        // recursive: true permite crear el directorio incluso si el padre no existe (aunque aquí solo es 'logs').
        await fs.mkdir(LOG_DIR, { recursive: true });
        console.log(`Directorio '${LOG_DIR}' verificado/creado.`);

        // Crea la entrada de log
        const timestamp = obtenerFechaHoraFormateada();
        const logEntry = `${timestamp} - Ejecución exitosa.\n`;
        
        // Agrega la línea al final del archivo app.log
        await fs.appendFile(LOG_FILE, logEntry, 'utf8');
        console.log(`Registro agregado al archivo ${LOG_FILE}.\n`);

    } catch (error) {
        console.error(error.message);
    }
}

async function mostrarUltimasEjecuciones() {
    try {
        
        const contenido = await fs.readFile(LOG_FILE, 'utf8');
        
        // Dividimos el contenido en un array de líneas
        // El método filter(Boolean) elimina las líneas vacías que puedan resultar
        const lineas = contenido.split('\n').filter(Boolean); 

        console.log(`Últimas 5 Ejecuciones Registradas`);

        if (lineas.length === 0) {
            console.log('El archivo de log está vacío.');
            return;
        }

        // Slice(inicio) toma elementos desde ese índice hasta el final del array.
        // Usamos Math.max(0, lineas.length - 5) para obtener el índice
        // que nos da las últimas 5 líneas (o menos si hay menos de 5).
        const ultimasLineas = lineas.slice(Math.max(0, lineas.length - 5));
        
        ultimasLineas.forEach(linea => {
            console.log(linea);
        });

    } catch (error) {
        return console.error(error.message);
    }
}

async function main() {
    console.log('--- Iniciando aplicación de Logger ---');
    
    await registrarEjecucion();
    
    await mostrarUltimasEjecuciones();
    
    console.log('\n--- Proceso finalizado ---');
}

main();