
const express = require('express');
const router = express.Router();
const HotelAccessibility = require('../models/hotelaccess.model');
const RestaurantAccessibility = require('../models/restauranteaccess.model');


router.post('/hotels', async (req, res) => {
  try {
    const hotelAccessibility = new HotelAccessibility(req.body);
    await hotelAccessibility.save();
    res.status(201).json({
      success: true,
      message: 'Cuestionario de accesibilidad para hotel creado exitosamente',
      data: hotelAccessibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cuestionario de accesibilidad para hotel', error });
  }
});


router.post('/restaurants', async (req, res) => {
  try {
    const restaurantAccessibility = new RestaurantAccessibility(req.body);
    await restaurantAccessibility.save();
    res.status(201).json({
      success: true,
      message: 'Cuestionario de accesibilidad para hotel creado exitosamente',
      data: hotelAccessibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cuestionario de accesibilidad para restaurante', error });
  }
});

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


router.put('/hotels/:hotelId', async (req, res) => {
  try {
    const hotelAccessibility = await HotelAccessibility.findOneAndUpdate(
      { hotelId: req.params.hotelId }, // Buscar el hotel por ID
      req.body, // Actualizar con los datos proporcionados en el cuerpo de la solicitud
      { new: true } // Devuelve el documento actualizado
    );

    if (!hotelAccessibility) {
      return res.status(404).json({ message: 'Cuestionario de accesibilidad para hotel no encontrado' });
    }

    res.json({
      success: true,
      message: 'Cuestionario de accesibilidad para hotel actualizado exitosamente',
      data: hotelAccessibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cuestionario de accesibilidad para hotel', error });
  }
});

// Actualizar cuestionario de accesibilidad para restaurante
router.put('/restaurants/:restaurantId', async (req, res) => {
  try {
    const restaurantAccessibility = await RestaurantAccessibility.findOneAndUpdate(
      { restaurantId: req.params.restaurantId }, // Buscar el restaurante por ID
      req.body, // Actualizar con los datos proporcionados en el cuerpo de la solicitud
      { new: true } // Devuelve el documento actualizado
    );

    if (!restaurantAccessibility) {
      return res.status(404).json({ message: 'Cuestionario de accesibilidad para restaurante no encontrado' });
    }

    res.json({
      success: true,
      message: 'Cuestionario de accesibilidad para restaurante actualizado exitosamente',
      data: restaurantAccessibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cuestionario de accesibilidad para restaurante', error });
  }
});




module.exports = router;
