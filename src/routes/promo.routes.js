const express = require('express');
const promoController = require('../controllers/promo.controller');
const router = express.Router();

router.post('/', promoController.createPromo);
router.get('/company/:businessId', promoController.getPromosByBusiness);
router.get('/:id', promoController.getPromoById);
router.put('/:id', promoController.updatePromo);
router.delete('/:id', promoController.deletePromo);

module.exports = router;
