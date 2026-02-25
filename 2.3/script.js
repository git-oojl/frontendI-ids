// Arreglo para guardar el historial
let historialNumeros = [];

const inputNumero = document.getElementById("numeroInput");
const btnEvaluar = document.getElementById("btnEvaluar");
const btnLimpiar = document.getElementById("btnLimpiar");
const resultado = document.getElementById("resultado");
const listaHistorial = document.getElementById("historial");
const estadisticas = document.getElementById("estadisticas");

function evaluarNumero(numero) {
  // Regresa un objeto simple: mensaje + tipo (para color)
  if (numero < 0) {
    return { mensaje: "Número negativo", tipo: "negativo" };
  } else if (numero >= 0 && numero <= 10) {
    return { mensaje: "Número pequeño", tipo: "pequeno" };
  } else if (numero > 10 && numero <= 50) {
    return { mensaje: "Número mediano", tipo: "mediano" };
  } else {
    return { mensaje: "Número grande", tipo: "grande" };
  }
}

// Validación
function validarEntrada(valorTexto) {
  const valor = valorTexto.trim();

  if (valor === "") {
    return { ok: false, mensaje: "Por favor ingresa un número" };
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return { ok: false, mensaje: "Entrada no válida" };
  }

  if (numero > 1000) {
    return { ok: true, numero, demasiadoAlto: true };
  }

  return { ok: true, numero, demasiadoAlto: false };
}

function colorPorTipo(tipo) {
  if (tipo === "negativo") return "red";
  if (tipo === "pequeno") return "blue";
  if (tipo === "mediano") return "orange";
  if (tipo === "grande") return "green";
  return "grey";
}

function mostrarResultado(mensaje, tipo = "") {
  resultado.textContent = mensaje;
  resultado.style.color = colorPorTipo(tipo);
}

// Historial
function renderHistorial() {
  listaHistorial.innerHTML = "";

  historialNumeros.forEach((num, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}) ${num}`;
    listaHistorial.appendChild(li);
  });
}

// Estadisticas (conteo, número mayor)
function actualizarEstadisticas() {
  const cantidad = historialNumeros.length;

  let mayor = "—";
  if (cantidad > 0) {
    mayor = Math.max(...historialNumeros);
  }

  estadisticas.textContent = `Evaluados: ${cantidad} | Mayor: ${mayor}`;
}

// Evaluar
btnEvaluar.addEventListener("click", () => {
  const validacion = validarEntrada(inputNumero.value);

  if (!validacion.ok) {
    mostrarResultado(validacion.mensaje, "");
    return;
  }

  const numero = validacion.numero;

  historialNumeros.push(numero);
  renderHistorial();
  actualizarEstadisticas();

  if (validacion.demasiadoAlto) {
    mostrarResultado("Número demasiado alto", "");
    return;
  }

  // Evaluación normal para <= 1000
  const evaluacion = evaluarNumero(numero);
  mostrarResultado(evaluacion.mensaje, evaluacion.tipo);
});

// Enter también evalúa
inputNumero.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnEvaluar.click();
});

btnLimpiar.addEventListener("click", () => {
  inputNumero.value = "";
  resultado.textContent = "";
  resultado.style.color = "black";

  historialNumeros = [];
  listaHistorial.innerHTML = "";

  actualizarEstadisticas();
});