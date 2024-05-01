const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/buscarAlumno', studentController.searchStudents);
router.post('/RegistrarReferenciaPersonalizada', studentController.RegistrarReferenciaPersonalizada);
router.post('/cicloescolar', studentController.cicloescolarComboBox);
router.get('/setearCombobox/:idUsuario', studentController.setearCombobox);
router.post('/registrarCicloEscolarFunction', studentController.registrarCicloEscolarFunction);
router.get('/buscarPeriodoConIdCiclo/:idCiclo', studentController.buscarPeriodoConIdCiclo);
module.exports = router;
