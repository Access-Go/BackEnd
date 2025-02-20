const express = require('express');
const promoController = require('../controllers/promo.controller');
const router = express.Router();
const multer = require('multer');

// Configuración de multer para almacenar archivos en memoria temporalmente
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 2); // Solo permite 2 imágenes


router.post('/', upload, promoController.createPromo);
router.get('/company/:businessId', promoController.getPromosByBusiness);
router.get('/:id', promoController.getPromoById);
router.put('/:id', promoController.updatePromo);
router.delete('/:id', promoController.deletePromo);

module.exports = router;
