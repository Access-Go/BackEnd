const express = require('express');
const phoneController = require('../controllers/phone.controller');

const router = express.Router();

router.post('/validate-phone', phoneController.validatePhone);

console.log('Rutas de validación de teléfono cargadas');

module.exports = router;