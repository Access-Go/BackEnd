const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyUserCode } = require('../usecases/verification.usecases');
const User = require('../models/register.model');

// Ruta para enviar el código de verificación
router.post('/send-code', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verifica si el usuario ya está verificado
        if (user.verified) {
            return res.status(400).json({ message: 'La cuenta ya está verificada.' });
        }

        // Enviar código de verificación
        await sendVerificationCode(user._id, email);
        return res.status(200).json({ message: 'Código de verificación enviado al correo.' });
    } catch (error) {
        console.error('Error al enviar el código de verificación:', error);
        return res.status(500).json({ message: 'Error al enviar el código de verificación.' });
    }
});

// Ruta para verificar el código
router.post('/verify-code', async (req, res) => {
    const { userId, code } = req.body;

    // Validación de entrada
    if (!userId || !code) {
        return res.status(400).json({ message: 'userId y código son requeridos.' });
    }

    try {
        const isVerified = await verifyUserCode(userId, code);

        if (!isVerified) {
            return res.status(400).json({ message: 'Código de verificación inválido o expirado.' });
        }

        return res.status(200).json({ message: 'Cuenta verificada exitosamente.', verified:true });
    } catch (error) {
        console.error('Error al verificar el código:', error);
        return res.status(500).json({ message: 'Error al verificar el código.' });
    }
});

module.exports = router;
