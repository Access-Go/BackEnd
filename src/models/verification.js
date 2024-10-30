const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users" // Refleja el nombre del modelo de usuario
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Código de verificación expira en una hora
    }
});

module.exports = mongoose.model("Verification", verificationSchema);
