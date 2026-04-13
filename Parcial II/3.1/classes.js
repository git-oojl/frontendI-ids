class Producto {
  constructor(id, nombre, precio, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
  }

  mostrarDetalle() {
    return `ID: ${this.id} | Nombre: ${this.nombre} | Precio: $${this.precio} | Categoría: ${this.categoria}`;
  }
}

const productos = [
  new Producto(1, "Laptop", 15000, "Computo"),
  new Producto(2, "Mouse", 250, "Accesorios"),
  new Producto(3, "Teclado", 600, "Accesorios"),
  new Producto(4, "Monitor 24”", 3200, "Computo"),
  new Producto(5, "Audífonos", 900, "Audio"),
  new Producto(6, "Bocina Bluetooth", 1200, "Audio"),
  new Producto(7, "Impresora", 2800, "Oficina"),
  new Producto(8, "USB 64GB", 180, "Almacenamiento"),
  new Producto(9, "SSD 1TB", 1600, "Almacenamiento"),
  new Producto(10, "Webcam HD", 700, "Computo"),
];

const btnMostrar = document.getElementById("btnMostrar");
const salida = document.getElementById("producto");

btnMostrar.addEventListener("click", () => {
  const i = Math.floor(Math.random() * productos.length);
  salida.textContent = productos[i].mostrarDetalle();
});