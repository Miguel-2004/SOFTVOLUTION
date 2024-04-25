const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Importar la configuración de la base de datos
const dbConfig = require("./config/dbConfig");


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Importar rutas
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const studentRoutes = require("./routes/studentRoutes");


// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'src', 'views'));

// Usar las rutas
app.use(authRoutes);
app.use(paymentRoutes);
app.use(studentRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});