import { appendFile } from 'fs/promises';
import { setTimeout } from 'timers/promises'; // Usaremos la versión con Promesas de setTimeout

const LOG_FILE = 'log.txt';
const TASK_DURATION_MS = 5000; // 5 segundos

function obtenerFechaHoraFormateada() {
    // Usamos 'new Date()' para obtener el objeto completo y formatearlo.
    const now = new Date(); 
    // Aseguramos que los componentes tengan dos dígitos.
    const pad = (num) => num.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

// Escribe un mensaje en el archivo log.txt, anteponiendo la fecha y hora.
async function registrarLog(mensaje) {
    const timestamp = obtenerFechaHoraFormateada();
    const logEntry = `${timestamp} - ${mensaje}\n`;

    try {
        await appendFile(LOG_FILE, logEntry, 'utf8');
        console.log(`REGISTRO: ${logEntry.trim()}`);
    } catch (error) {
        console.error('Error al escribir en log.txt:', error.message);
    }
}


// Registra el inicio, espera 5 segundos y registra la finalización.
async function ejecutarTareaSimulada() {
    await registrarLog('Ejecutando tarea...');
    
    await setTimeout(TASK_DURATION_MS); 
    
    await registrarLog('Tarea completada');
}

async function main() {
    await registrarLog('Inicio del programa');

    await ejecutarTareaSimulada();
}

main();