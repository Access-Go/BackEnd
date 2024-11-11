const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankingSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: false,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ranking', rankingSchema);
