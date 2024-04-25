const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/buscarAlumno', studentController.searchStudents);

module.exports = router;
