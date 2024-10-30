const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyUserCode, updateVerifiedTrue, fyndByEmail } = require('../usecases/verification.usecases');
const Users = require('../models/user.model');


// Ruta para enviar el código de verificación
router.post('/send-code', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await Users.findOne({ email });
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

// Ruta para actualizar el estado de verificación a "true"
router.patch('/verified-true', async (req, res) => {
    const { userId } = req.body;

    // Validación de entrada
    if (!userId) {
        return res.status(400).json({ message: 'El ID de usuario es requerido.' });
    }

    try {
        // Llama a la función para actualizar el estado de verificación a true
        const updatedUser = await updateVerifiedTrue(userId);

        if (updatedUser) {
            return res.status(200).json({ message: 'El estado de verificación ha sido actualizado exitosamente.', user: updatedUser });
        }

        return res.status(404).json({ message: 'Usuario no encontrado.' });
    } catch (error) {
        console.error('Error al actualizar el estado de verificación:', error);
        return res.status(500).json({ message: 'Error al actualizar el estado de verificación.' });
    }
});

router.post('/checkEmail', async (req, res) => {
    const { email, context } = req.body; // Obtén el contexto de la solicitud

    try {
        const result = await fyndByEmail(email);

        // Si el usuario no existe
        if (!result.exists) {
            return res.status(404).json({ message: result.message });
        }

        // Responde según el estado de verificación del usuario
        if (result.verified) {
            return res.status(200).json({ message: 'Correo encontrado y verificado.' });
        } else {
            // Si el contexto es 'createAccount', puedes enviar un mensaje diferente
            if (context === 'crearAccount') {
                return res.status(200).json({ message: 'Correo encontrado pero no verificado. Envíe el código de verificación.' });
            } else {
                return res.status(200).json({ message: 'Correo encontrado pero no verificado.' });
            }
        }

    } catch (error) {
        console.error('Error al verificar el correo:', error);
        return res.status(500).json({ message: 'Error al verificar el correo.' });
    }
});


module.exports = router;
