const fs = require("fs");
const readline = require("readline");

// Crear interfaz para leer datos desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para preguntar al usuario
function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

// Función principal
async function main() {
  console.log("=== Búsqueda de nombres en archivo ===");

  // Validar si el archivo existe
  if (!fs.existsSync("datos.txt")) {
    console.log("Error: el archivo datos.txt no existe.");
    rl.close();
    return;
  }

  let contenido = "";

  // Leer el archivo
  try {
    contenido = fs.readFileSync("datos.txt", "utf8");
  } catch (error) {
    console.log("Error al leer el archivo:", error.message);
    rl.close();
    return;
  }

  // Validar si el archivo está vacío
  if (contenido.trim() === "") {
    console.log("El archivo datos.txt está vacío.");
    rl.close();
    return;
  }

  // Convertir el contenido en un arreglo de nombres
  const nombres = contenido
    .split("\n")
    .map((nombre) => nombre.trim())
    .filter((nombre) => nombre !== "");

  // Mostrar el contenido leído
  console.log("\nContenido del archivo:");
  nombres.forEach((nombre) => console.log(nombre));

  // Pedir al usuario el nombre a buscar
  const nombreBuscado = (await preguntar("\nIngresa el nombre que deseas buscar: ")).trim();

  // Validar entrada vacía
  if (nombreBuscado === "") {
    console.log("No ingresaste un nombre válido.");
    rl.close();
    return;
  }

  // Buscar coincidencias sin importar mayúsculas o minúsculas
  let contador = 0;

  for (const nombre of nombres) {
    if (nombre.toLowerCase() === nombreBuscado.toLowerCase()) {
      contador++;
    }
  }

  // Mostrar resultado
  if (contador > 0) {
    console.log(`\nEl nombre "${nombreBuscado}" sí fue encontrado.`);
    console.log(`Aparece ${contador} vez/veces en el archivo.`);
  } else {
    console.log(`\nEl nombre "${nombreBuscado}" no fue encontrado en el archivo.`);
    console.log("Aparece 0 veces.");
  }

  rl.close();
}

// Ejecutar programa
main();