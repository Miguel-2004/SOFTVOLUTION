const db = require('../config/dbConfig');

// Lógica para obtener la vista de inicio de sesión
const getLogin = (req, res) => {
  res.render("login", { errorMessage: null });
};

// Lógica para procesar el inicio de sesión
const postLogin = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND contrasenia = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta:", err);
        res.status(500).send("Error al autenticar al usuario");
        return;
      }

      if (results.length > 0) {
        const { IdUsuario, Nombre, Apellido_paterno, Matricula } = results[0];
        let rol = determinarRol(Matricula);

        // Lógica de renderización basada en el rol
        switch (rol) {
          case "Maestria":
          case "Universitario":
            res.render("sesionEstudiante", {
              idUsuario: IdUsuario,
              nombre: Nombre,
              apellido: Apellido_paterno,
              matricula: Matricula,
              rol: rol,
            });
            break;
          case "Administrador":
            res.render("sesionAdmin", {
              idUsuario: IdUsuario,
              nombre: Nombre,
              apellido: Apellido_paterno,
              matricula: Matricula,
              rol: rol,
            });
            break;
          default:
            res.render("login", {
              errorMessage: "Correo electrónico o contraseña incorrectos",
            });
        }
      } else {
        res.render("login", {
          errorMessage: "Correo electrónico o contraseña incorrectos",
        });
      }
    }
  );
};

// Función auxiliar para determinar el rol del usuario
const determinarRol = (matricula) => {
  if (matricula < 2000000) {
    return "Universitario";
  } else if (matricula >= 2000000 && matricula < 3000000) {
    return "Administrador";
  } else if (matricula >= 8000000) {
    return "Maestria";
  }
  return "Sin rol definido";
};

module.exports = {
  getLogin,
  postLogin
};