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

const HotelAccessibilitySchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  disabilities: [DisabilitySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('HotelAccessibility', HotelAccessibilitySchema);