const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); //body-parser cambiado a express.json 

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: "root",
  password: "EMI",
  database: "inventario_ropa"
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});


// Obtener todos los productos
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});


// Agregar producto bajo una categoria
app.post("/productos", (req, res) => {
  const { nombre, talla, color, precio, stock, categoria } = req.body;

  const sql = `
    INSERT INTO productos (nombre, talla, color, precio, stock, categoria)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nombre, talla, color, precio, stock, categoria], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ mensaje: "Producto agregado correctamente" });
    }
  });
});


// Actualizar stock
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { cambio } = req.body;

  const sql = `
    UPDATE productos 
    SET stock = GREATEST(stock + ?, 0)
    WHERE id = ?
  `;

  db.query(sql, [cambio, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ mensaje: "Stock actualizado correctamente" });
    }
  });
});


// Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ mensaje: "Producto eliminado correctamente" });
    }
  });
});


app.use(express.static(path.join(__dirname, "Views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "index.html"));
});


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
