const fs = require("fs");
const readline = require("readline");

// Interfaz para leer datos desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para preguntar en consola usando promesas
function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

// Función principal
async function main() {
  const nombres = [];

  console.log("=== Registro de nombres ===");
  console.log("Debes ingresar al menos 5 nombres.");
  console.log("No se permitirán nombres duplicados.\n");

  // Pedir nombres hasta tener al menos 5.
  // Después de 5, el usuario puede presionar ENTER vacío para terminar.
  while (true) {
    const entrada = await preguntar(`Ingresa un nombre (${nombres.length + 1}): `);
    const nombre = entrada.trim();

    // Si el usuario quiere terminar
    if (nombre === "") {
      if (nombres.length >= 5) {
        break;
      } else {
        console.log("Debes ingresar al menos 5 nombres.\n");
        continue;
      }
    }

    // Evitar duplicados sin importar mayúsculas/minúsculas
    const duplicado = nombres.some(
      (n) => n.toLowerCase() === nombre.toLowerCase()
    );

    if (duplicado) {
      console.log("Ese nombre ya fue ingresado. Intenta con otro.\n");
      continue;
    }

    nombres.push(nombre);
  }

  const contenidoOriginal = nombres.join("\n");

  try {
    const fd = fs.openSync("datos.txt", "w");
    fs.writeSync(fd, contenidoOriginal, "utf8");
    fs.closeSync(fd);
    console.log("\nArchivo datos.txt creado correctamente.");
  } catch (error) {
    console.log("Error al crear o escribir datos.txt:", error.message);
    rl.close();
    return;
  }

  if (!fs.existsSync("datos.txt")) {
    console.log("Error: el archivo datos.txt no existe.");
    rl.close();
    return;
  }

  let contenidoLeido = "";

  try {
    contenidoLeido = fs.readFileSync("datos.txt", "utf8");
  } catch (error) {
    console.log("Error al leer datos.txt:", error.message);
    rl.close();
    return;
  }

  // Validación: archivo vacío
  if (contenidoLeido.trim() === "") {
    console.log("El archivo datos.txt está vacío.");
    rl.close();
    return;
  }

  console.log("\n=== Contenido completo de datos.txt ===");
  console.log(contenidoLeido);

  const listaOriginal = contenidoLeido
    .split("\n")
    .map((nombre) => nombre.trim())
    .filter((nombre) => nombre !== "");

  const listaMayusculas = listaOriginal.map((nombre) => nombre.toUpperCase());

  console.log("\n=== Nombres en mayúsculas ===");
  listaMayusculas.forEach((nombre) => console.log(nombre));

  const totalNombres = listaOriginal.length;

  let nombreMasLargo = listaOriginal[0];
  for (const nombre of listaOriginal) {
    if (nombre.length > nombreMasLargo.length) {
      nombreMasLargo = nombre;
    }
  }

  const listaOrdenada = [...listaOriginal].sort((a, b) =>
    a.localeCompare(b, "es")
  );

  console.log("\n=== Resultados ===");
  console.log("Cantidad total de nombres:", totalNombres);
  console.log("Nombre con mayor longitud:", nombreMasLargo);

  console.log("\n=== Nombres ordenados alfabéticamente ===");
  listaOrdenada.forEach((nombre) => console.log(nombre));

  const resultado = `
=== Lista original ===
${listaOriginal.join("\n")}

=== Lista en mayúsculas ===
${listaMayusculas.join("\n")}

=== Lista ordenada alfabéticamente ===
${listaOrdenada.join("\n")}

=== Total de nombres ===
${totalNombres}

=== Nombre con mayor longitud ===
${nombreMasLargo}
`;

  try {
    fs.writeFileSync("resultado.txt", resultado.trim(), "utf8");
    console.log("\nArchivo resultado.txt creado correctamente.");
  } catch (error) {
    console.log("Error al escribir resultado.txt:", error.message);
  }

  rl.close();
}

// Ejecutar programa
main();