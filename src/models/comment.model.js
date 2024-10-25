const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register',
    required: true
  },
  id_empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
