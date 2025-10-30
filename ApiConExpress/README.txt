Preguntas para reflexionar
1.	¿Cuál es la diferencia entre parámetros en la ruta y parámetros en query?
Los parámetros en la ruta forman parte del endpoint (por ejemplo /users/:id) y se usan para identificar recursos específicos, mientras que los parámetros en query (/users?name=Juan) se usan para filtrar o modificar la respuesta sin cambiar la ruta.

2.	¿Qué ventajas tiene usar Express sobre Node.js puro?

Express simplifica la creación de servidores en Node.js, ofreciendo manejo de rutas, middlewares, errores y peticiones de forma más legible y rápida que con Node.js puro.

3.	¿Qué es un middleware y para qué se puede usar?

Un middleware es una función que se ejecuta entre la petición y la respuesta; se usa para validar datos, autenticar usuarios, registrar logs o manejar errores.

4.	¿Qué hace app.listen y qué pasa si no se ejecuta?

app.listen inicia el servidor y lo pone a escuchar en un puerto; si no se ejecuta, el servidor no acepta peticiones.

5.	¿Qué códigos HTTP se utilizan para indicar éxito o error y cuál es la diferencia entre ellos?

Los códigos HTTP 2xx indican éxito (como 200 OK o 201 Created), mientras que los 4xx y 5xx indican errores del cliente o del servidor, respectivamente.

6.	¿Cuál es la diferencia entre un middleware global y uno local?

Un middleware global se aplica a todas las rutas, mientras que uno local solo a rutas específicas.

7.	¿Qué ocurre si no llamamos a next() dentro de un middleware?

Si no se llama a next(), la ejecución se detiene y la petición queda sin respuesta.

8.	¿Por qué conviene validar datos antes de procesar una ruta?
Conviene validar los datos antes de procesar una ruta para evitar errores, asegurar la integridad del sistema y protegerlo de ataques o entradas inválidas.
