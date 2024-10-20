const { sendVerificationCode, verifyUserCode } = require('../usecases/verification.usecases');
const User = require('../models/register.model');

/**
 * Controlador para enviar un código de verificación al correo del usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const sendCodeController = async (req, res) => {
    const { email } = req.body;

    try {
        // Busca al usuario por el correo electrónico
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Llama al caso de uso para enviar el código de verificación
        await sendVerificationCode(user._id, email);

        res.status(200).json({ message: 'Código de verificación enviado al correo.' });
    } catch (error) {
        console.error('Error al enviar código de verificación:', error);
        res.status(500).json({ message: 'Hubo un error al enviar el código de verificación.' });
    }
};

/**
 * Controlador para verificar el código ingresado por el usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const verifyCodeController = async (req, res) => {
    const { userId, code } = req.body; // Cambiar a userId

    // Validación de entrada
    if (!userId || !code) {
        return res.status(400).json({ message: 'userId y código son requeridos.' });
    }

    try {
        // Verifica el código usando el userId y el código
        const isVerified = await verifyUserCode(userId, code);

        if (isVerified) {
            res.status(200).json({ message: 'Usuario verificado exitosamente.' });
        } else {
            res.status(400).json({ message: 'Código de verificación incorrecto o expirado.' });
        }
    } catch (error) {
        console.error('Error al verificar el código:', error);
        res.status(500).json({ message: 'Hubo un error al verificar el código.' });
    }
};



module.exports = {
    sendCodeController,
    verifyCodeController
};
