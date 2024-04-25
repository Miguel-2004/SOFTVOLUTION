const db = require('../config/dbConfig');
const fechaActual = new Date(); // Consider moving this inside the function if you want the exact current time

const getPaymentsByUser = (req, res) => {
  const { idUsuario } = req.params;
  db.query(
    "SELECT * FROM pagos WHERE idUsuario = ?",
    [idUsuario],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta:", err);
        res
          .status(500)
          .json({ error: "Error al obtener los datos de los pagos" });
        return;
      }

      // Enviar los datos de los pagos como respuesta
      res.json(results);
    }
  );
};

const updatePayment = (req, res) => {
  try {
    const { idPagoValor, idUsuarioValor, montoValor, fechaEmisionValor, fechaLimiteValor, fechaPagoValor, estadoValor, modalidadValor, conceptoValor } = req.body;

    const sqlQuery = `UPDATE pagos SET monto = ${montoValor}, fechaEmision = '${fechaEmisionValor}', fechaLimite = '${fechaLimiteValor}', fechaPago = '${fechaPagoValor}', estado = '${estadoValor}', modalidad = '${modalidadValor}', concepto = '${conceptoValor}' WHERE idPago = ${idPagoValor} AND idUsuario = ${idUsuarioValor}`;

    db.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        res.status(500).json({ error: 'Error al realizar el pago' });
      } else {
        console.log("Pago actualizado correctamente idPagoValor:", idPagoValor);
        res.status(200).json({ message: `Pago actualizado correctamente${idPagoValor} - ${idUsuarioValor} ` });
      }
    });
  } catch (error) {
    console.error("Error en el endpoint /actualizarPago:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const pay = (req, res) => {
  const idsCheckboxSelectedList = req.body.idsCheckboxSelectedList;
  const modalidadPago = req.body.modalidadPago;
  let errores = [];
  let exitos = [];

  idsCheckboxSelectedList.forEach((idPago, index, array) => {
    const fechaActualSQL = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const sqlQuery = `UPDATE pagos SET estado = 'Aprobado', modalidad = ?, fechaPago = ? WHERE idPago = ?`;

    db.query(sqlQuery, [modalidadPago, fechaActualSQL, idPago], (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        errores.push(idPago);
      } else {
        console.log("Pago actualizado correctamente:", idPago);
        exitos.push(idPago);
      }
      // Solo envía la respuesta cuando todos los pagos han sido procesados
      if (index === array.length - 1) {
        if (errores.length > 0) {
          res.status(500).json({
            error: "Algunos pagos no pudieron ser procesados",
            exitos: exitos,
            errores: errores,
          });
        } else {
          res.send("Todos los pagos han sido actualizados correctamente");
        }
      }
    });
  });
};

const searchPendingPayments = (req, res) => {
  // La consulta SQL para seleccionar todos los pagos con estado 'Pendiente'
  const sqlQuery = "SELECT * FROM pagos WHERE estado = 'Pendiente'";

  // Ejecutar la consulta SQL
  db.query(sqlQuery, (error, results) => {
      if (error) {
          // Si hay un error con la consulta, envía una respuesta de error
          console.error("Error al buscar pagos pendientes:", error);
          return res.status(500).json({ error: 'Error al buscar pagos pendientes' });
      }
      
      // Si la consulta fue exitosa, envía los resultados
      res.json({ pagos: results });
  });
};

module.exports = {
  getPaymentsByUser,
  updatePayment,
  pay,
  searchPendingPayments
};
