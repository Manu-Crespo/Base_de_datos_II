import * as fs from 'fs/promises';

const FILE_NAME = 'contactos.json';

async function leerContactos() {
    try {
        const data = await fs.readFile(FILE_NAME, 'utf8');
        // El método JSON.parse() convierte el string JSON en un objeto JavaScript
        return JSON.parse(data);
    } catch (error) {

        return console.error(error.message); 
    }
}

async function guardarContactos(contactos) {
    // El 'null, 2' formatea el JSON con indentación para que sea legible
    const jsonString = JSON.stringify(contactos, null, 2); 
    // Escribe el string JSON de vuelta al archivo
    await fs.writeFile(FILE_NAME, jsonString, 'utf8');
}

async function agregarContacto(nombre, telefono, email) {
    try {
        console.log(`\nAgregando contacto: ${nombre}`);
        const contactos = await leerContactos();

        const nuevoContacto = {
            nombre,
            telefono,
            email
        };

        contactos.push(nuevoContacto);
        await guardarContactos(contactos);
        console.log(`Contacto "${nombre}" agregado con éxito.`);

    } catch (error) {
        console.error('Error al agregar contacto:', error.message);
    }
}

async function mostrarContactos() {
    try {
        const contactos = await leerContactos();

        if (contactos.length === 0) {
            console.log('No hay contactos para mostrar.');
            return;
        }

        contactos.forEach((c, index) => {
            console.log(`${index + 1}. Nombre: ${c.nombre}, Teléfono: ${c.telefono}`);
            console.log(`Email: ${c.email}`);
        });

    } catch (error) {
        console.error('Error al mostrar contactos:', error.message);
    }
}

async function eliminarContacto(nombre) {
    try {
        console.log(`\nIntentando eliminar a: ${nombre}`);
        let contactos = await leerContactos();
        
        const contactosAntes = contactos.length;
        contactos = contactos.filter(c => c.nombre !== nombre);
        const contactosDespues = contactos.length;

        if (contactosAntes === contactosDespues) {
            console.log(`Contacto "${nombre}" no encontrado.`);
            return;
        }

        await guardarContactos(contactos);
        console.log(`Contacto "${nombre}" eliminado con éxito.`);

    } catch (error) {
        console.error('Error al eliminar contacto:', error.message);
    }
}

async function main() {
    
    const contactoInicial = [{
        "nombre": "Juan Pérez",
        "telefono": "123-456-7890",
        "email": "juan@example.com"
    }];
    await guardarContactos(contactoInicial);
    console.log(`El archivo ${FILE_NAME} ha sido inicializado.`);
    console.log('--------------------------------------------------');
    
    // Agrega un contacto nuevo
    await agregarContacto('Carlos López', '987-654-3210', 'carlos@example.com');
    
    await mostrarContactos();
    
    await eliminarContacto('Juan Pérez');
    
    await mostrarContactos();
    
    console.log('\n--- PRUEBAS FINALIZADAS ---');
}

main();