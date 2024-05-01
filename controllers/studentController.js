const db = require("../config/dbConfig");

const searchStudents = (req, res) => {
  const { nombre } = req.query;

  db.query(
    `SELECT * FROM usuarios WHERE CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) LIKE ?`,
    [`%${nombre}%`],
    (err, students) => {
      if (err) {
        console.error("Error al buscar alumnos:", err);
        return res
          .status(500)
          .json({ error: "Error al buscar estudiantes en la base de datos" });
      }

      if (students.length > 0) {
        // Podrías optar por devolver todos los estudiantes encontrados o solo el primero
        const student = students[0]; // Si solo deseas devolver el primer alumno encontrado

        // Si deseas obtener también los pagos del primer alumno encontrado:
        db.query(
          `SELECT * FROM pagos WHERE IdUsuario = ?`,
          [student.IdUsuario],
          (err, pagos) => {
            if (err) {
              console.error("Error al buscar los pagos del alumno:", err);
              return res
                .status(500)
                .json({
                  error:
                    "Error al buscar los pagos del alumno en la base de datos",
                });
            }

            // Enviar los datos del alumno y sus pagos como respuesta en formato JSON
            res.json({ alumno: student, pagos: pagos });
          }
        );
      } else {
        res
          .status(404)
          .json({ error: "No se encontró ningún alumno con ese nombre" });
      }
    }
  );
};
