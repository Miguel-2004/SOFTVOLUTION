const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/pagos/:idUsuario', paymentController.getPaymentsByUser);
router.post('/pagar', paymentController.pay);
router.post('/actualizarPago', paymentController.updatePayment);
router.get('/buscarPagosPendientes', paymentController.searchPendingPayments);

module.exports = router;