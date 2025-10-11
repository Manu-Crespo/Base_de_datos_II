import * as fs from 'fs/promises';
import { constants } from 'fs';

async function main() {
    
    const archivoOrigen = process.argv[2];
    const archivoDestino = process.argv[3];

    try {
        
        // constants.F_OK verifica si el archivo es visible/existe.
        console.log(`Verificando existencia del archivo de origen: "${archivoOrigen}"...`);
        await fs.access(archivoOrigen, constants.F_OK);
        console.log('\nArchivo de origen encontrado.');

        // fs.copyFile es la forma más eficiente para copiar archivos completos.
        await fs.copyFile(archivoOrigen, archivoDestino);

        // 4. Mostrar mensaje de confirmación
        console.log(`\n¡Copia completada con éxito!`);

    } catch (error) {

        return console.error(error.message);
    }
}

main();