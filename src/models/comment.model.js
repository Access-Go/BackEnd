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
const modelName = 'Comment';

/**
 * -----------------------------------------------------------------
 * Creamos nuestro esquema
 * -----------------------------------------------------------------
 */
const commentSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    },
    content: {
        type: String,
        required: true,
        maxLength: 500
    },
    rankingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ranking',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: { 
        type: Number, 
        default: 0,
        required: false 
    }, 
    dislikes: { 
        type: Number, 
        default: 0,
        required: false 
    },
    likedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users', 
        },
      ],
      dislikedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users', // IDs de usuarios que dieron dislike
        },
      ],
});

module.exports = mongoose.model(modelName, commentSchema);

