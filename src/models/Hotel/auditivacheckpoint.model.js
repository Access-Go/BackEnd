const mongoose = require('mongoose');

const auditivaCheckpointsHotelSchema = new mongoose.Schema({
  id_empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
})


const AuditivaCheckpointsHotel = mongoose.model('AuditivaCheckpointsHotel', auditivaCheckpointsHotelSchema);

module.exports = AuditivaCheckpointsHotel;