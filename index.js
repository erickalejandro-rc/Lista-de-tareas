// index.js
// ----------------------
// Servidor Express que responde con la lista de todos desde SQLite
// ----------------------

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000; // puerto donde correrá el servidor

// ----------------------
// Conectar con la base de datos SQLite
// ----------------------
// Se utiliza path.join para asegurar que la ruta funcione en Windows/Linux/Mac
// 
// 'todos.db' debe estar en la misma carpeta que este archivo index.js.
// Si tu archivo está en otra carpeta, ajusta la ruta.
const dbPath = path.join(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log('Conectado a la BD SQLite en', dbPath);
  }
});

// ----------------------
// Middleware (opcional)
// ----------------------
app.use(express.json()); // si en el futuro quieres recibir JSON (POST/PUT)

// ----------------------
// Endpoint: GET /todos
// - Ejecuta un SELECT para obtener todos los registros de la tabla "todos".
// - Devuelve un arreglo JSON con los objetos { id, todo, created_at }.
// ----------------------
app.get('/todos', (req, res) => {
  // Consulta SQL que selecciona todos los campos de la tabla todos
  const sql = 'SELECT id, todo, created_at FROM todos ORDER BY id ASC';

  // db.all ejecuta la consulta y devuelve todas las filas en un arreglo
  db.all(sql, [], (err, rows) => {
    if (err) {
      // Si ocurre un error en la consulta, devolvemos 500 y un mensaje de error
      console.error('Error en SELECT:', err.message);
      return res.status(500).json({ error: 'Error al obtener los todos' });
    }

    // rows es un arreglo de objetos con las columnas definidas en la consulta
    // Enviamos el arreglo como JSON con código HTTP 200 (OK)
    return res.status(200).json(rows);
  });
});

// ----------------------
// Ruta raíz informativa (opcional)
// ----------------------
app.get('/', (req, res) => {
  res.send('API de ejemplo: GET /todos -> devuelve lista en JSON');
});

// ----------------------
// Iniciar servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://127.0.0.1:${PORT}`);
});

// ----------------------
// Nota: no cerramos la conexión `db` aquí, la dejamos abierta mientras el servidor corre.
// Si detienes la app, Node liberará recursos; en apps más grandes es buena idea cerrar db al terminar.
// ----------------------
