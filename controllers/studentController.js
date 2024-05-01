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

const RegistrarReferenciaPersonalizada = (req, res) => {
  try {
    const { idUsuario, referencia } = req.body;

    // Consulta SQL usando marcadores de posición para valores
    const sqlQuery = `
      UPDATE usuarios
      SET
      Referencia = '${referencia}'
      Where IdUsuario = '${idUsuario}'
      
    `;

    // Ejecutar la consulta SQL de forma segura
    db.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        return res
          .status(500)
          .json({ error: "Error al actualizar la Referencia" });
      }
      console.log("Pago actualizado correctamente:", results);
      return res
        .status(200)
        .json({
          message: `Referencia actualizada correctamente para el  id: ${idUsuario}.`,
        });
    });
  } catch (error) {
    console.error("Error en el endpoint /actualizarPago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const cicloescolarComboBox = (req, res) => {
  try {
    // Aquí no necesitas obtener datos del cuerpo de la solicitud, ya que es una consulta simple
    const sqlQuery = "SELECT * FROM cicloescolar";

    // Ejecutar la consulta SQL de forma segura
    db.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        return res
          .status(500)
          .json({ error: "Error al obtener los ciclos escolares" });
      }
      console.log("Ciclos escolares obtenidos correctamente:", results);
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error en el endpoint /cicloescolar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const registrarCicloEscolarFunction = (req, res) => {
  try {
    const { IdCicloActual, idUsuario } = req.body;

    // Consulta SQL usando marcadores de posición para valores
    const sqlQuery = `
      UPDATE relacionusuariociclo
      SET
      idCiclo = '${IdCicloActual}'
      Where idUsuario = '${idUsuario}'
      
    `;

    // Ejecutar la consulta SQL de forma segura
    db.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        return res
          .status(500)
          .json({ error: "Error al actualizar la Referencia" });
      }
      console.log("Ciclo actualizado correctamente:", results);
      return res
        .status(200)
        .json({
          message: `Ciclo actualizada correctamente para el  id: ${idUsuario}.`,
        });
    });
  } catch (error) {
    console.error("Error en el endpoint /actualizarPago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const setearCombobox = (req, res) => {
  try {
    const idUsuario = req.params.idUsuario; // Asumimos que el idUsuario viene como parámetro de la ruta

    // Consulta SQL usando marcadores de posición para prevenir inyecciones SQL
    const sqlQuery = `
      SELECT idCiclo FROM relacionusuariociclo
      WHERE idUsuario = ${idUsuario}
    `;

    // Ejecutar la consulta SQL de forma segura
    db.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        return res
          .status(500)
          .json({ error: "Error al recuperar los ciclos escolares" });
      }
      console.log("Ciclos escolares recuperados correctamente:", results);
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error en el endpoint /usuarioCiclo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
