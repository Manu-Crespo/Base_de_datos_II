const express = require('express');
const app = express();
const PORT = 3000;

// Contador para el middleware "contarPeticiones"
let contador = 0;

// ---------------------------------------------------------------------
// 1. MIDDLEWARES GLOBALES Y LOCALES
// ---------------------------------------------------------------------

/**
 * TODO: Crear un middleware "contarPeticiones" que escuche todas las
 * peticiones y vaya sumando 1 al contador.
 */
const contarPeticiones = (req, res, next) => {
    contador++;
    console.log(`Petición N°: ${contador} | Método: ${req.method} | URL: ${req.originalUrl}`);
    next(); // Permite que la petición continúe a la siguiente función o ruta
};

/**
 * Middleware para registrar la fecha, método, URL e IP del cliente (Tarea Adicional)
 */
const logPeticion = (req, res, next) => {
    const ahora = new Date().toLocaleString();
    const metodo = req.method;
    const url = req.originalUrl;
    const ip = req.ip; // o req.socket.remoteAddress
    console.log(`[LOG] Fecha: ${ahora} | Método: ${metodo} | URL: ${url} | IP: ${ip}`);
    next();
};

/**
 * TODO: Crear un middleware "validarEdad" que lea req.query.edad
 * y verifique que sea un número mayor o igual a 18.
 * Si no cumple, responder con status 400 y mensaje "Acceso denegado".
 */
const validarEdad = (req, res, next) => {
    const edad = parseInt(req.query.edad);

    // 1. Verificar si el parámetro 'edad' existe
    if (req.query.edad === undefined) {
        return res.status(400).send('Error 400: Falta el parámetro "edad" en el query string.');
    }

    // 2. Verificar si es un número válido y es >= 18
    if (isNaN(edad) || edad < 18) {
        // Si no es un número o es menor de 18, enviamos Bad Request (400)
        return res.status(400).send('Acceso denegado: La edad debe ser un número igual o mayor a 18.');
    }

    // Si la validación es exitosa, pasamos a la siguiente función de la ruta
    next();
};

// Aplicar middlewares de forma global a todas las peticiones
app.use(logPeticion);
app.use(contarPeticiones);

// ---------------------------------------------------------------------
// 2. DECLARACIÓN DE RUTAS
// ---------------------------------------------------------------------

/**
 * TODO: Ruta principal '/' que devuelva un mensaje de bienvenida.
 * Ejemplo: http://localhost:3000/
 */
app.get('/', (req, res) => {
    // Código de estado 200 (OK) implícito
    res.send('<h1>👋 Bienvenido a la API del TP N°2 con Express!</h1><p>Pruebe las diferentes rutas (/saludo/nombre, /suma, /edad, /producto/id, /promedio, /hora).</p>');
});

/**
 * TODO: Crear una ruta con parámetro en la URL, por ejemplo '/saludo/:nombre'.
 * Debe devolver un saludo personalizado.
 * Ejemplo: http://localhost:3000/saludo/Juan
 */
app.get('/saludo/:nombre', (req, res) => {
    // req.params contiene los parámetros de la ruta (ej. :nombre)
    const nombre = req.params.nombre;
    res.status(200).send(`Hola, **${nombre}**. ¡Bienvenido a Express!`);
});

/**
 * TODO: Crear una ruta '/suma' que reciba num1 y num2 por query string y devuelva la suma.
 * TODO: Manejar los casos en los que los parámetros sean inválidos o falten.
 * Ejemplo: http://localhost:3000/suma?num1=10&num2=5
 */
app.get('/suma', (req, res) => {
    // req.query contiene los parámetros del query string (ej. ?num1=...&num2=...)
    const num1Str = req.query.num1;
    const num2Str = req.query.num2;

    // Validación de existencia de parámetros
    if (!num1Str || !num2Str) {
        return res.status(400).send('Error 400: Faltan los parámetros "num1" y/o "num2". Uso: /suma?num1=X&num2=Y');
    }

    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    // Validación de tipo (deben ser números)
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('Error 400: Los parámetros "num1" y "num2" deben ser valores numéricos válidos.');
    }

    const resultado = num1 + num2;

    // Devolver el resultado en formato JSON (Express lo hace automáticamente si usamos res.json)
    res.json({
        operacion: 'suma',
        num1: num1,
        num2: num2,
        resultado: resultado
    });
});

/**
 * TODO: Crear una ruta extra, por ejemplo '/fecha', que devuelva la fecha actual.
 * Ejemplo: http://localhost:3000/fecha
 */
app.get('/fecha', (req, res) => {
    const fechaActual = new Date();
    res.status(200).json({
        fecha: fechaActual.toLocaleDateString(),
        hora: fechaActual.toLocaleTimeString(),
        timestamp: fechaActual.toISOString()
    });
});

/**
 * TODO: Crear una ruta '/edad' que use el middleware "validarEdad"
 * y devuelva "Acceso permitido" si la edad es válida.
 * Esta ruta solo se ejecutará si validarEdad llama a next().
 * Ejemplo: http://localhost:3000/edad?edad=25
 */
app.get('/edad', validarEdad, (req, res) => {
    // Si llegamos a esta función, significa que validarEdad llamó a next()
    const edad = req.query.edad;
    res.status(200).send(`✅ Acceso permitido. Tienes ${edad} años.`);
});

/**
 * TODO: Crear una ruta '/producto/:id' que reciba un id numérico.
 * Si el id no es un número, devolver error 400.
 * Si es válido, devolver un mensaje con el id.
 * Ejemplo: http://localhost:3000/producto/99
 */
app.get('/producto/:id', (req, res) => {
    const idStr = req.params.id;
    const id = parseInt(idStr);

    // Validación: verificar si el ID es un número entero
    if (isNaN(id) || !Number.isInteger(parseFloat(idStr))) {
        return res.status(400).send('Error 400: El ID del producto debe ser un número entero válido.');
    }

    res.status(200).send(`Producto encontrado (simulación). ID: ${id}`);
});

/**
 * TODO: Crear una ruta '/promedio' que reciba tres notas por query (n1, n2, n3)
 * y devuelva el promedio.
 * Si falta alguna nota o no son números, devolver error 400.
 * Ejemplo: http://localhost:3000/promedio?n1=8&n2=6&n3=10
 */
app.get('/promedio', (req, res) => {
    const { n1, n2, n3 } = req.query;

    // 1. Validación de existencia de parámetros
    if (!n1 || !n2 || !n3) {
        return res.status(400).send('Error 400: Faltan uno o más parámetros de nota (n1, n2, n3).');
    }

    const nota1 = parseFloat(n1);
    const nota2 = parseFloat(n2);
    const nota3 = parseFloat(n3);

    // 2. Validación de tipo numérico
    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
        return res.status(400).send('Error 400: Todas las notas (n1, n2, n3) deben ser valores numéricos válidos.');
    }

    const promedio = (nota1 + nota2 + nota3) / 3;

    res.status(200).json({
        notas: [nota1, nota2, nota3],
        promedio: parseFloat(promedio.toFixed(2)) // Redondear a 2 decimales
    });
});

/**
 * TODO: Crear una ruta '/hora' que devuelva la hora actual del servidor.
 * Ejemplo: http://localhost:3000/hora
 */
app.get('/hora', (req, res) => {
    const horaActual = new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    res.status(200).json({
        horaServidor: horaActual
    });
});

// ---------------------------------------------------------------------
// 3. MANEJO DE RUTA NO ENCONTRADA (404)
// ---------------------------------------------------------------------

// Middleware para manejar rutas no definidas (siempre debe ir al final)
app.use((req, res, next) => {
    res.status(404).send('Error 404: Ruta no encontrada. Verifique la URL.');
});

// ---------------------------------------------------------------------
// 4. INICIAR SERVIDOR
// ---------------------------------------------------------------------

/**
 * Iniciar el servidor
 */
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    console.log('Rutas disponibles: /, /saludo/:nombre, /suma, /fecha, /edad, /producto/:id, /promedio, /hora');
});