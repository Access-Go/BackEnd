const mongoose = require('mongoose');
const HotelAccessibility = require('../models/hotelaccess.model');
const RestaurantAccessibility = require('../models/restauranteaccess.model');
const Company = require('../models/company.model'); // Asegúrate de tener el modelo de Company

// Crear o actualizar cuestionario de accesibilidad para hotel
async function handleHotelAccessibility(companyId, accessibilityData) {
  try {
    // Verificar si el companyId es válido y convertirlo en un ObjectId si es necesario
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error('El ID de la empresa no es válido.');
    }

    // Verificar que la empresa (hotel) exista
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('La empresa no existe.');
    }

    // Buscar si ya existe un cuestionario para el hotel
    let hotelAccesibility = await HotelAccessibility.findOne({ hotelId: companyId });

    if (hotelAccesibility) {
      // Si ya existe, actualizamos
      hotelAccesibility.disabilities = accessibilityData.disabilities;
      hotelAccesibility.updatedAt = Date.now();
      await hotelAccesibility.save();
      return hotelAccesibility;
    } else {
      // Si no existe, lo creamos
      hotelAccesibility = new HotelAccessibility({
        hotelId: companyId,
        disabilities: accessibilityData.disabilities,
      });
      await hotelAccesibility.save();

      // Asociamos el cuestionario de accesibilidad al modelo de la empresa (hotel)
      company.accessibility = hotelAccesibility._id;
      await company.save();

      return hotelAccesibility;
    }
  } catch (error) {
    throw new Error('Error al manejar la accesibilidad para el hotel: ' + error.message);
  }
}

// Crear o actualizar cuestionario de accesibilidad para restaurante
async function handleRestaurantAccessibility(companyId, accessibilityData) {
  try {
    // Verificar si el companyId es válido y convertirlo en un ObjectId si es necesario
    

    // Verificar que la empresa (restaurante) exista
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('La empresa no existe.');
    }

    // Buscar si ya existe un cuestionario para el restaurante
    let restaurantAccesibility = await RestaurantAccessibility.findOne({ restaurantId: companyId });

    if (restaurantAccesibility) {
      // Si ya existe, actualizamos
      restaurantAccesibility.disabilities = accessibilityData.disabilities;
      restaurantAccesibility.updatedAt = Date.now();
      await restaurantAccesibility.save();
      return restaurantAccesibility;
    } else {
      // Si no existe, lo creamos
      restaurantAccesibility = new RestaurantAccessibility({
        restaurantId: companyId,
        disabilities: accessibilityData.disabilities,
      });
      await restaurantAccesibility.save();

      // Asociamos el cuestionario de accesibilidad al modelo de la empresa (restaurante)
      company.accessibility = restaurantAccesibility._id;
      await company.save();

      return restaurantAccesibility;
    }
  } catch (error) {
    throw new Error('Error al manejar la accesibilidad para el restaurante: ' + error.message);
  }
}

module.exports = {
  handleHotelAccessibility,
  handleRestaurantAccessibility,
};
