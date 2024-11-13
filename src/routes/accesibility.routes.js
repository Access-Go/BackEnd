// routes/accessibility.js
const express = require('express');
const router = express.Router();
const HotelAccessibility = require('../models/hotelaccess.model');
const RestaurantAccessibility = require('../models/restauranteaccess.model');

// Crear cuestionario de accesibilidad para hotel
router.post('/hotels', async (req, res) => {
  try {
    const hotelAccessibility = new HotelAccessibility(req.body);
    await hotelAccessibility.save();
    res.status(201).json(hotelAccessibility);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cuestionario de accesibilidad para hotel', error });
  }
});

// Crear cuestionario de accesibilidad para restaurante
router.post('/restaurants', async (req, res) => {
  try {
    const restaurantAccessibility = new RestaurantAccessibility(req.body);
    await restaurantAccessibility.save();
    res.status(201).json(restaurantAccessibility);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cuestionario de accesibilidad para restaurante', error });
  }
});

// Obtener cuestionarios de accesibilidad para hotel
router.get('/hotels/:hotelId', async (req, res) => {
  try {
    const hotelAccessibility = await HotelAccessibility.findOne({ hotelId: req.params.hotelId }).populate('hotelId');
    if (!hotelAccessibility) {
      return res.status(404).json({ message: 'Cuestionario de accesibilidad para hotel no encontrado' });
    }
    res.json(hotelAccessibility);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cuestionario de accesibilidad para hotel', error });
  }
});

// Obtener cuestionarios de accesibilidad para restaurante
router.get('/restaurants/:restaurantId', async (req, res) => {
  try {
    const restaurantAccessibility = await RestaurantAccessibility.findOne({ restaurantId: req.params.restaurantId }).populate('restaurantId');
    if (!restaurantAccessibility) {
      return res.status(404).json({ message: 'Cuestionario de accesibilidad para restaurante no encontrado' });
    }
    res.json(restaurantAccessibility);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cuestionario de accesibilidad para restaurante', error });
  }
});

module.exports = router;
