/**
* -----------------------------------------------------------------
* Importamos mongoose
* -----------------------------------------------------------------
*/
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo
 * -----------------------------------------------------------------
 */
const modelName = 'Volunteer';


/**
 * -----------------------------------------------------------------
 * Esquema para voluntariado
 * -----------------------------------------------------------------
 */
const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
  },
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  address: {
    type: String,
    required: true,
    maxLength: 200,
  },
  contact: {
    type: String,
    required: true,
    maxLength: 100,
  },
  activities: {
    type: String,
    required: true,
    maxLength: 1000,
  },
},{
  timestamps: true, 
});

module.exports = mongoose.model(modelName, volunteerSchema);
