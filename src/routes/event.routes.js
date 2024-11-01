const express = require('express');
const eventController = require('../controllers/event.controller');
const router = express.Router();

router.post('/', eventController.createEvent);
router.get('/business/:businessId', eventController.getEventsByBusiness);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
