// modulos/CommonJS/saludo.js

function saludar(nombre) {
  console.log(`Hola ${nombre}!`);
}

// Exportamos la función para que sea accesible desde otros archivos
module.exports = {
  saludar: saludar
};

// O la forma corta: module.exports = { saludar };