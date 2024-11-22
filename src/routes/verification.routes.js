const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyUserCode, updateVerifiedTrue, fyndByEmail } = require('../usecases/verification.usecases');
const Users = require('../models/user.model');
const Company = require ("../models/company.model")


router.post('/send-code', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await Users.findOne({ email });
        if (!user) {
            user = await Company.findOne({ email });
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (user.verified) {
            return res.status(400).json({ message: 'La cuenta ya está verificada.' });
        }
        await sendVerificationCode(user._id, email);

        return res.status(200).json({ message: 'Código de verificación enviado al correo.' });
    } catch (error) {
        console.error('Error al enviar el código de verificación:', error);
        return res.status(500).json({ message: 'Error al enviar el código de verificación.' });
    }
});


router.post('/verify-code', async (req, res) => {
    const { userId, code } = req.body;
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


router.patch('/verified-true', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'El ID de usuario es requerido.' });
    }

    try {
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
    const { email, context } = req.body; 

    try {
        const result = await fyndByEmail(email);
        if (!result.exists) {
            return res.status(404).json({ message: result.message });
        }
        if (result.verified) {
            return res.status(200).json({ message: 'Correo encontrado y verificado.' });
        } else {
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
