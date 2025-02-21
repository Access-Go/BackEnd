const express = require('express');
const promoController = require('../controllers/promo.controller');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage(); // Guardar archivos en memoria temporal
const upload = multer({ storage }).array("images", 2);  // Asegurar que 'images' coincida con el frontend


router.post('/', upload, promoController.createPromo);
router.get('/company/:businessId', promoController.getPromosByBusiness);
router.get('/:id', promoController.getPromoById);
router.put('/:id', promoController.updatePromo);
router.delete('/:id', promoController.deletePromo);

module.exports = router;
