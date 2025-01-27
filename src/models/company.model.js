/**
 * -----------------------------------------------------------------
 * Importamos mongoose
 * -----------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para compañías
 * -----------------------------------------------------------------
 */
const modelName = 'Company';

/**
 * -----------------------------------------------------------------
 * Creamos nuestro esquema para compañías
 * -----------------------------------------------------------------
 */
const companySchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    required: false,
    maxLength: 300,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 4,
    maxLength: 30
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 60
  },
  type: {
    type: String,
    enum: ['company'],
    default: 'company',
    required: true
  },
  companyName: {
    type: String,
    required: false,
    maxLength: 100
  },
  rfc: {
    type: String,
    required: false,
    maxLength: 13
  },
  representanteLegal: {
    type: String,
    required: false,
    maxLength: 100
  },
  giro: {
    type: String,
    required: false,
    maxLength: 50
  },
  horario: {
    abre: { type: String, required: false },
    cierra: { type: String, required: false },
    abierto24horas: { type: Boolean, default: false },
  },
  diasDeServicio: {
    type: [String],
    required: false
  },
  description: {
    type: String,
    required: false,
    maxLength: 500
  },
  address: {
    type: String,
    required: false
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  phone: {
    type: String,
    required: false,
    match: /^\+?[1-9]\d{1,14}$/
  },
  rfc: {
    type: String,
    required: false,
    match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i
  },
  tipo: {
    type: String,
    enum: ['HotelAccessibility', 'RestaurantAccessibility'],
    required: false
  },
  cuenta: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
    required: false
  },
  premiumFeatures: {
    maxLocations: {
      type: Number,
      default: 1
    },
    promoYevetos:
      [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promo',
        required: false
      }]
  },
  averageRating: {
    type: Number,
    default: 0
  },
  accessibility: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipo',
    required: false,
  },
  redesSociales: {
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false }
  },
  lugares:{
    recreativos: {
      type: [String],
      required: false
    },
    emergencia: {
      type: [String],
      required: false
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  verificationSentAt: {
    type: Date
  }
});

/**
 * -----------------------------------------------------------------
 * Middleware para actualizar `updated_at` cuando se modifica el documento
 * -----------------------------------------------------------------
 */
companySchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

companySchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: Date.now() });
  next();
});
/**
 * -----------------------------------------------------------------
 * Exportamos el modelo de compañía
 * -----------------------------------------------------------------
 */
module.exports = mongoose.model(modelName, companySchema);

