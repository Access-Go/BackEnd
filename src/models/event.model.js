/**
 * -----------------------------------------------------------------
 * Importamos mongoose
 * -----------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para eventos
 * -----------------------------------------------------------------
 */
const modelName = 'Event';

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para eventos
 * -----------------------------------------------------------------
 */
const eventSchema = new mongoose.Schema({
  bussinessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 500
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  openingTime: {
    type: Number,
    required: true
  },
  closingTime: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model(modelName, eventSchema);