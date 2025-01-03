const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  response: {
    type: Boolean,
    default: false
  },
});

const SectionSchema = new mongoose.Schema({
  name: {
    type:
      String,
    required: true
  },
  questions: [QuestionSchema],
});

const DisabilitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Motriz', 'Visual', 'Auditiva', 'Intelectual', 'Neurodivergente'],
  },
  sections: [SectionSchema],
});

const RestaurantAccessibilitySchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  disabilities: [DisabilitySchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('RestaurantAccessibility', RestaurantAccessibilitySchema);