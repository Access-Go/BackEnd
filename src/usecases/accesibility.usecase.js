const mongoose = require('mongoose');
const HotelAccessibility = require('../models/hotelaccess.model');
const RestaurantAccessibility = require('../models/restauranteaccess.model');
const Company = require('../models/company.model');

// Función genérica para manejar la creación o actualización de cuestionarios de accesibilidad
async function handleAccessibility(companyId, accessibilityData, model, type) {
  try {
    // Verificar si el companyId es válido
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error('El ID de la empresa no es válido.');
    }

    // Verificar que la empresa exista
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('La empresa no existe.');
    }

    // Buscar si ya existe un cuestionario para el tipo de empresa
    let accessibilityRecord = await model.findOne({ [`${type}Id`]: companyId });

    if (accessibilityRecord) {
      // Si ya existe, actualizamos
      accessibilityRecord.disabilities = accessibilityData.disabilities;
      await accessibilityRecord.save();
      return accessibilityRecord;
    } else {
      // Si no existe, lo creamos
      accessibilityRecord = new model({
        [`${type}Id`]: companyId,
        disabilities: accessibilityData.disabilities,
      });
      await accessibilityRecord.save();

      // Asociamos el cuestionario de accesibilidad al modelo de la empresa
      company.accessibility = accessibilityRecord._id;
      await company.save();

      return accessibilityRecord;
    }
  } catch (error) {
    throw new Error(`Error al manejar la accesibilidad para ${type}: ${error.message}`);
  }
}

// Función para manejar el cuestionario de accesibilidad para hotel
async function handleHotelAccessibility(companyId, accessibilityData) {
  return await handleAccessibility(companyId, accessibilityData, HotelAccessibility, 'hotel');
}

// Función para manejar el cuestionario de accesibilidad para restaurante
async function handleRestaurantAccessibility(companyId, accessibilityData) {
  return await handleAccessibility(companyId, accessibilityData, RestaurantAccessibility, 'restaurant');
}

module.exports = {
  handleHotelAccessibility,
  handleRestaurantAccessibility,
};
