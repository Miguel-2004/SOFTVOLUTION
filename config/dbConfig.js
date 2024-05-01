const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "universidad",
  // multipleStatements: true  // Habilitar ejecución de múltiples sentencias
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    throw err;
  }
  console.log("Conexión establecida con la base de datos MySQL");
});

module.exports = connection;