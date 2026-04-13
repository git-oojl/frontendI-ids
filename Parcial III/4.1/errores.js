// Estado (historial)

const historialOperaciones = []; // se guarda durante la sesión

// DOM: referencias
const $num1 = document.getElementById("num1");
const $num2 = document.getElementById("num2");
const $op = document.getElementById("op");
const $btn = document.getElementById("btnCalcular");
const $salida = document.getElementById("salida");
const $historial = document.getElementById("historial");

// Utilidades
const OPERACIONES_VALIDAS = new Set(["suma", "resta", "multiplicacion", "division"]);

function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

function toNumberOrThrow(raw, fieldName) {
  // Validación: no vacío
  if (isBlank(raw)) {
    throw new Error(`Campo vacío: ${fieldName}. Ingresa un valor.`);
  }

  // Convertir (permitir decimales)
  const n = Number(String(raw).trim());

  // Validación: numérico real
  if (!Number.isFinite(n)) {
    throw new Error(`Dato no numérico: ${fieldName}. Ingresa un número válido.`);
  }
  return n;
}

// Validaciones (separadas)
function validarOperacion(operacion) {
  if (!OPERACIONES_VALIDAS.has(operacion)) {
    throw new Error(`Operación inválida: "${operacion}". Usa suma, resta, multiplicacion o division.`);
  }
}

function validarDivisionEntreCero(operacion, b) {
  if (operacion === "division" && b === 0) {
    throw new Error("División entre cero: el divisor no puede ser 0.");
  }
}

// Lógica de operaciones
function ejecutarOperacion(a, b, operacion) {
  switch (operacion) {
    case "suma": return a + b;
    case "resta": return a - b;
    case "multiplicacion": return a * b;
    case "division": return a / b;
    default:
      // Esto no debería ocurrir si ya validamos,
      // pero lo dejamos por seguridad.
      throw new Error(`Operación no soportada: "${operacion}".`);
  }
}

function calcularOperacion(valor1, valor2, operacion) {
  validarOperacion(operacion);
  validarDivisionEntreCero(operacion, valor2);
  return ejecutarOperacion(valor1, valor2, operacion);
}

// DOM: render de mensajes
function renderSalida({ type, title, message }) {
  // type: "success" | "error" | "warning"
  const badgeClass = type === "success" ? "b-ok" : type === "warning" ? "b-warn" : "b-err";
  const typeClass = type;

  $salida.className = `salida ${typeClass}`;
  $salida.innerHTML = `
    <div class="badge ${badgeClass}">${title}</div>
    <p class="msg">${message}</p>
  `;
}

function simboloOperacion(op) {
  return ({ suma: "+", resta: "-", multiplicacion: "×", division: "÷" })[op] || op;
}

function renderHistorial() {
  $historial.innerHTML = "";

  if (historialOperaciones.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="small">Aún no hay operaciones registradas.</span>`;
    $historial.appendChild(li);
    return;
  }

  historialOperaciones.forEach((item) => {
    const li = document.createElement("li");

    const etiqueta = item.status === "ok" ? "☑" : item.status === "warn" ? "⚠" : "🗙";
    li.innerHTML = `
      <div class="fila">
        <strong>${etiqueta} ${item.expresion}</strong>
        <span class="small">(${item.timestamp})</span>
      </div>
      <div class="small">${item.detalle}</div>
    `;

    $historial.appendChild(li);
  });
}

// Manejo de evento (try/catch/finally)
$btn.addEventListener("click", () => {
  // Este try/catch controla errores de validación o ejecución
  try {
    // 1) Lectura y validación de entradas
    const a = toNumberOrThrow($num1.value, "Número 1");
    const b = toNumberOrThrow($num2.value, "Número 2");
    const operacion = $op.value;

    // 2) Ejecutar operación
    const resultado = calcularOperacion(a, b, operacion);

    // 3) Advertencias (no bloquean): ejemplo UX extra
    let warning = null;
    if (Math.abs(resultado) > 1e9) warning = "Resultado muy grande: revisa que los valores sean correctos.";
    if (operacion === "division" && !Number.isInteger(resultado)) {
      warning = warning ?? "División con decimales: el resultado no es un entero.";
    }

    // 4) Mostrar salida (DOM)
    if (warning) {
      renderSalida({
        type: "warning",
        title: "Advertencia",
        message: `${a} ${simboloOperacion(operacion)} ${b} = <strong>${resultado}</strong><br><span class="small">${warning}</span>`
      });
      historialOperaciones.unshift({
        status: "warn",
        expresion: `${a} ${simboloOperacion(operacion)} ${b} = ${resultado}`,
        detalle: warning,
        timestamp: new Date().toLocaleString()
      });
    } else {
      renderSalida({
        type: "success",
        title: "Resultado",
        message: `${a} ${simboloOperacion(operacion)} ${b} = <strong>${resultado}</strong>`
      });
      historialOperaciones.unshift({
        status: "ok",
        expresion: `${a} ${simboloOperacion(operacion)} ${b} = ${resultado}`,
        detalle: "Operación realizada correctamente.",
        timestamp: new Date().toLocaleString()
      });
    }

    renderHistorial();

  } catch (error) {
    console.error("Detalle técnico del error:", error);

    renderSalida({
      type: "error",
      title: "Error",
      message: `${error.message}`
    });

    historialOperaciones.unshift({
      status: "err",
      expresion: "Operación fallida",
      detalle: error.message,
      timestamp: new Date().toLocaleString()
    });
    renderHistorial();

  } finally {
    console.log("La operación ha finalizado (finally).");
  }
});

// Render inicial del historial vacío
renderHistorial();