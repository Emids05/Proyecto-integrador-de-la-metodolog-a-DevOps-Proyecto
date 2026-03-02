const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "EMI",
  database: "inventario_ropa"
});

db.connect(err => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  console.log("Conectado para prueba de carga");
});

const totalRegistros = 150000;
const lote = 5000; // Insertaremos en bloques

async function insertarDatos() {
  console.time("Tiempo total de inserción");

  for (let i = 0; i < totalRegistros; i += lote) {
    let valores = [];

    for (let j = 0; j < lote; j++) {
      valores.push([
        `Producto ${i + j}`,
        "M",
        "Negro",
        (Math.random() * 500).toFixed(2),
        Math.floor(Math.random() * 100),
        "Camisas"
      ]);
    }

    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO productos (nombre, talla, color, precio, stock, categoria) VALUES ?",
        [valores],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log(`Insertados ${i + lote} registros`);
  }

  console.timeEnd("Tiempo total de inserción");
  db.end();
}

insertarDatos();