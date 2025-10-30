const { MongoClient } = require('mongodb');

// Reemplaza con tu URI de conexión si es diferente
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
    try {
        // Conectarse al servidor de MongoDB
        await client.connect();
        console.log("Conectado exitosamente a la base de datos");

        // Seleccionar la base de datos. Si no existe, se creará al insertar datos.
        const db = client.db("biblioteca");

        // Limpiar colecciones para una ejecución limpia cada vez
        await db.collection('autores').deleteMany({});
        await db.collection('libros').deleteMany({});
        await db.collection('estudiantes').deleteMany({});
        await db.collection('cursos').deleteMany({});
        console.log("Colecciones limpiadas.");

        // --- Ejercicio 1 ---
        console.log("\n--- INICIO EJERCICIO 1 ---");

        // 1. Insertar autores
        const autor1 = await db.collection('autores').insertOne({ nombre: "Gabriel García Márquez", fecha_nacimiento: 1927 });
        const autor2 = await db.collection('autores').insertOne({ nombre: "Isabel Allende", fecha_nacimiento: 1942 });
        const autor3 = await db.collection('autores').insertOne({ nombre: "Jorge Luis Borges", fecha_nacimiento: 1899 });

        const autor1_id = autor1.insertedId;
        const autor2_id = autor2.insertedId;
        const autor3_id = autor3.insertedId;

        console.log("IDs de Autores:");
        console.log("GGM: " + autor1_id);
        console.log("IA: " + autor2_id);
        console.log("JLB: " + autor3_id);

        // 2. Insertar libros
        await db.collection('libros').insertMany([
            { titulo: "Cien años de soledad", paginas: 417, categorias: ["Ficción", "Realismo Mágico"], autor_id: autor1_id },
            { titulo: "El amor en los tiempos del cólera", paginas: 348, categorias: ["Ficción", "Romance"], autor_id: autor1_id },
            { titulo: "La casa de los espíritus", paginas: 433, categorias: ["Ficción", "Drama"], autor_id: autor2_id },
            { titulo: "Eva Luna", paginas: 310, categorias: ["Ficción"], autor_id: autor2_id },
            { titulo: "Ficciones", paginas: 180, categorias: ["Cuentos", "Filosofía"], autor_id: autor3_id }
        ]);
        console.log("Libros insertados.");

        const librosConAutor = await db.collection('libros').aggregate([
            { $lookup: { from: "autores", localField: "autor_id", foreignField: "_id", as: "datos_autor" } },
            { $unwind: "$datos_autor" },
            { $project: { _id: 0, titulo: "$titulo", paginas: "$paginas", categorias: "$categorias", autor: "$datos_autor.nombre" } }
        ]).toArray();
        console.log("\nLibros con nombre de autor:", JSON.stringify(librosConAutor, null, 2));

        await db.collection('libros').updateOne({ titulo: "Cien años de soledad" }, { $set: { paginas: 450 } });
        const libroActualizado = await db.collection('libros').find({ titulo: "Cien años de soledad" }).toArray();
        console.log("\nVerificación de actualización:", JSON.stringify(libroActualizado, null, 2));

        const autor_a_eliminar = await db.collection('autores').findOne({ nombre: "Isabel Allende" });
        if (autor_a_eliminar) {
            const autor_a_eliminar_id = autor_a_eliminar._id;
            await db.collection('libros').deleteMany({ autor_id: autor_a_eliminar_id });
            await db.collection('autores').deleteOne({ _id: autor_a_eliminar_id });
            console.log("\nAutor 'Isabel Allende' y sus libros han sido eliminados.");
        }

        const librosRestantes = await db.collection('libros').find({}).toArray();
        console.log("\nVerificación de eliminación (libros restantes):", JSON.stringify(librosRestantes, null, 2));

        const promedioPaginas = await db.collection('libros').aggregate([
            { $group: { _id: "$autor_id", promedio_paginas: { $avg: "$paginas" } } },
            { $lookup: { from: "autores", localField: "_id", foreignField: "_id", as: "datos_autor" } },
            { $unwind: "$datos_autor" },
            { $project: { _id: 0, autor: "$datos_autor.nombre", "promedio de paginas": { $round: ["$promedio_paginas", 2] } } }
        ]).toArray();
        console.log("\nPromedio de páginas por autor:", JSON.stringify(promedioPaginas, null, 2));

        const cantidadLibros = await db.collection('libros').aggregate([
            { $group: { _id: "$autor_id", cantidad_libros: { $sum: 1 } } },
            { $lookup: { from: "autores", localField: "_id", foreignField: "_id", as: "datos_autor" } },
            { $unwind: "$datos_autor" },
            { $project: { _id: 0, autor: "$datos_autor.nombre", "cantidad de libros": "$cantidad_libros" } }
        ]).toArray();
        console.log("\nCantidad de libros por autor:", JSON.stringify(cantidadLibros, null, 2));

        // --- Ejercicio 2 ---
        console.log("\n--- INICIO EJERCICIO 2 ---");

        const estudiantes_res = await db.collection('estudiantes').insertMany([
            { nombre: "Ana Martínez", email: "ana.m@email.com", edad: 22 },
            { nombre: "Roberto Gómez", email: "roberto.g@email.com", edad: 25 },
            { nombre: "Sofía Pérez", email: "sofia.p@email.com", edad: 21 },
            { nombre: "Javier López", email: "javier.l@email.com", edad: 28 }
        ]);
        console.log("\nEstudiantes insertados.");

        const estudiante_ids = Object.values(estudiantes_res.insertedIds);
        const ana_id = estudiante_ids[0];
        const roberto_id = estudiante_ids[1];
        const sofia_id = estudiante_ids[2];
        const javier_id = estudiante_ids[3];

        console.log("IDs de Estudiantes:");
        console.log("Ana: " + ana_id);
        console.log("Roberto: " + roberto_id);
        console.log("Sofía: " + sofia_id);
        console.log("Javier: " + javier_id);

        await db.collection('cursos').insertMany([
            { titulo: "Introducción a MongoDB", descripcion: "Conceptos básicos de NoSQL.", estudiantes_ids: [ana_id, roberto_id, sofia_id] },
            { titulo: "Programación Avanzada en Python", descripcion: "Temas avanzados de Python.", estudiantes_ids: [roberto_id, javier_id] },
            { titulo: "Desarrollo Web con Node.js", descripcion: "Construcción de APIs REST.", estudiantes_ids: [ana_id] }
        ]);
        console.log("\nCursos insertados.");

        const cursosConEstudiantes = await db.collection('cursos').aggregate([
            { $lookup: { from: "estudiantes", localField: "estudiantes_ids", foreignField: "_id", as: "estudiantes_inscritos" } },
            { $project: { _id: 0, titulo: "$titulo", descripcion: "$descripcion", "estudiantes inscritos": "$estudiantes_inscritos.nombre" } }
        ]).toArray();
        console.log("\nCursos con estudiantes inscritos:", JSON.stringify(cursosConEstudiantes, null, 2));

        await db.collection('estudiantes').updateOne({ nombre: "Ana Martínez" }, { $set: { email: "anamartinez@nuevo-email.net" } });
        const estudianteActualizado = await db.collection('estudiantes').find({ nombre: "Ana Martínez" }).toArray();
        console.log("\nVerificación de actualización de estudiante:", JSON.stringify(estudianteActualizado, null, 2));

        const curso_a_eliminar = await db.collection('cursos').findOne({ titulo: "Desarrollo Web con Node.js" });
        if (curso_a_eliminar) {
            await db.collection('cursos').deleteOne({ _id: curso_a_eliminar._id });
            console.log("\nCurso 'Desarrollo Web con Node.js' eliminado.");
        }

        const cursosRestantes = await db.collection('cursos').find({}).toArray();
        console.log("\nVerificación de eliminación de curso:", JSON.stringify(cursosRestantes, null, 2));

        const cantidadEstudiantesPorCurso = await db.collection('cursos').aggregate([
            { $project: { _id: 0, titulo: "$titulo", "cantidad estudiantes": { $size: "$estudiantes_ids" } } }
        ]).toArray();
        console.log("\nCantidad de estudiantes por curso:", JSON.stringify(cantidadEstudiantesPorCurso, null, 2));

        const estudiantesEnMultiplesCursos = await db.collection('cursos').aggregate([
            { $unwind: "$estudiantes_ids" },
            { $group: { _id: "$estudiantes_ids", cursos_inscritos: { $sum: 1 } } },
            { $match: { cursos_inscritos: { $gt: 1 } } },
            { $lookup: { from: "estudiantes", localField: "_id", foreignField: "_id", as: "datos_estudiante" } },
            { $unwind: "$datos_estudiante" },
            { $project: { _id: 0, estudiante: "$datos_estudiante.nombre", "cursos inscritos": "$cursos_inscritos" } }
        ]).toArray();
        console.log("\nEstudiantes inscritos en más de un curso:", JSON.stringify(estudiantesEnMultiplesCursos, null, 2));

    } catch (e) {
        console.error("Ocurrió un error:", e);
    } finally {
        // Asegurarse de que el cliente se cierre cuando termines/ocurra un error
        await client.close();
        console.log("\nConexión a la base de datos cerrada.");
    }
}

// Llamar a la función principal para ejecutar el script
main().catch(console.error);