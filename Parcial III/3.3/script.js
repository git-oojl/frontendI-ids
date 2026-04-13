const App = (() => {
  "use strict";

  const KEY = "tienda_empleados_v1";
  const $ = (id) => document.getElementById(id);

  const uid = () =>
    `EMP-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

  const money = (n) =>
    Number(n).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  // ===== Modelo (POO) =====
  class Tienda {
    static Empleado = class Empleado {
      constructor({ nombre, puesto, salario, identificador }) {
        this.nombre = String(nombre || "").trim();
        this.puesto = String(puesto || "").trim();
        this.salario = Number(salario);
        this.identificador = String(identificador || "").trim();
      }
    };

    constructor() {
      this.empleados = [];
    }

    add(datos) {
      const emp = new Tienda.Empleado({
        ...datos,
        identificador: (datos.identificador || "").trim() || uid(),
      });

      if (!emp.nombre || !emp.puesto || Number.isNaN(emp.salario)) {
        throw new Error("Datos inválidos. Revisa nombre, puesto y salario.");
      }
      if (this.empleados.some((e) => e.identificador === emp.identificador)) {
        throw new Error("Ya existe un empleado con ese identificador.");
      }

      this.empleados.push(emp);
      return emp;
    }

    remove(id) {
      const before = this.empleados.length;
      this.empleados = this.empleados.filter((e) => e.identificador !== id);
      return this.empleados.length !== before;
    }

    list() {
      return [...this.empleados];
    }

    filterByPuesto(puesto) {
      const p = String(puesto).trim().toLowerCase();
      return this.empleados.filter((e) => e.puesto.toLowerCase() === p);
    }

    sortBySalario(asc = true) {
      return this.list().sort((a, b) => (asc ? a.salario - b.salario : b.salario - a.salario));
    }

    setFromPlain(list) {
      this.empleados = (list || []).map((e) => new Tienda.Empleado(e));
    }
  }

  // ===== Storage (localStorage) =====
  const Storage = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
      } catch {
        return [];
      }
    },
    save(list) {
      localStorage.setItem(KEY, JSON.stringify(list));
    },
    clear() {
      localStorage.removeItem(KEY);
    },
  };

  // ===== UI (DOM) =====
  const tienda = new Tienda();
  let els = {};

  const setMsg = (text = "", type = "") => {
    els.mensaje.textContent = text;
    els.mensaje.className = `mensaje ${type}`.trim();
  };

  const render = (list) => {
    els.tbody.innerHTML = "";

    if (!list || list.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.className = "empty";
      td.textContent = "Sin empleados para mostrar.";
      tr.appendChild(td);
      els.tbody.appendChild(tr);
      return;
    }

    list.forEach((e) => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = e.identificador;

      const tdNom = document.createElement("td");
      tdNom.textContent = e.nombre;

      const tdPuesto = document.createElement("td");
      tdPuesto.textContent = e.puesto;

      const tdSal = document.createElement("td");
      tdSal.className = "num";
      tdSal.textContent = money(e.salario);

      const tdAcc = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn small danger";
      btn.textContent = "Eliminar";
      btn.dataset.id = e.identificador;
      tdAcc.appendChild(btn);

      tr.append(tdId, tdNom, tdPuesto, tdSal, tdAcc);
      els.tbody.appendChild(tr);
    });
  };

  const refreshPuestos = () => {
    const puestos = [...new Set(tienda.list().map((e) => e.puesto.trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "es"));

    els.filtro.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "__TODOS__";
    optAll.textContent = "Todos";
    els.filtro.appendChild(optAll);

    puestos.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      els.filtro.appendChild(opt);
    });
  };

  const sync = (listToRender = tienda.list()) => {
    Storage.save(tienda.list());
    refreshPuestos();
    render(listToRender);
  };

  const init = () => {
    els = {
      form: $("formEmpleado"),
      nombre: $("nombre"),
      puesto: $("puesto"),
      salario: $("salario"),
      identificador: $("identificador"),

      btnMostrar: $("btnMostrar"),
      btnAsc: $("btnOrdenarAsc"),
      btnDesc: $("btnOrdenarDesc"),
      btnFiltrar: $("btnFiltrar"),
      btnLimpiar: $("btnLimpiar"),

      filtro: $("filtroPuesto"),
      tbody: $("tbodyEmpleados"),
      mensaje: $("mensaje"),
    };

    // Cargar persistencia
    tienda.setFromPlain(Storage.load());
    refreshPuestos();
    render(tienda.list());

    // Agregar empleado
    els.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      setMsg();

      try {
        tienda.add({
          nombre: els.nombre.value,
          puesto: els.puesto.value,
          salario: els.salario.value,
          identificador: els.identificador.value,
        });
        els.form.reset();
        sync();
        setMsg("Empleado agregado correctamente", "ok");
      } catch (e) {
        setMsg(e.message || "Error al agregar empleado.", "bad");
      }
    });

    // Mostrar lista
    els.btnMostrar.addEventListener("click", () => {
      setMsg();
      const list = tienda.list();
      if (list.length === 0) setMsg("No existen empleados registrados.", "warn");
      render(list);
    });

    // Ordenar salario
    els.btnAsc.addEventListener("click", () => {
      setMsg();
      const list = tienda.sortBySalario(true);
      if (list.length === 0) setMsg("No existen empleados registrados.", "warn");
      render(list);
    });

    els.btnDesc.addEventListener("click", () => {
      setMsg();
      const list = tienda.sortBySalario(false);
      if (list.length === 0) setMsg("No existen empleados registrados.", "warn");
      render(list);
    });

    // Filtrar por puesto
    els.btnFiltrar.addEventListener("click", () => {
      setMsg();

      if (tienda.list().length === 0) {
        setMsg("No existen empleados registrados.", "warn");
        render([]);
        return;
      }

      const v = els.filtro.value;
      if (v === "__TODOS__") {
        setMsg("Mostrando todos los empleados.", "ok");
        render(tienda.list());
        return;
      }

      const filtered = tienda.filterByPuesto(v);
      if (filtered.length === 0) setMsg("No hay resultados para el puesto seleccionado.", "warn");
      else setMsg(`Resultados para puesto: ${v}`, "ok");
      render(filtered);
    });

    // Eliminar (delegación)
    els.tbody.addEventListener("click", (ev) => {
      const btn = ev.target.closest("button[data-id]");
      if (!btn) return;

      const ok = tienda.remove(btn.dataset.id);
      if (!ok) return setMsg("No se pudo eliminar (ID no encontrado).", "bad");

      sync();
      setMsg("Empleado eliminado", "ok");
    });

    // Borrar todo
    els.btnLimpiar.addEventListener("click", () => {
      if (!confirm("¿Seguro que deseas borrar TODOS los empleados guardados?")) return;
      Storage.clear();
      tienda.setFromPlain([]);
      refreshPuestos();
      render([]);
      setMsg("Datos borrados de localStorage", "ok");
    });
  };

  document.addEventListener("DOMContentLoaded", init);

  return { Tienda, tienda, Storage };
})();