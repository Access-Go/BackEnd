const { sendVerificationCode, verifyUserCode, updateVerifiedTrue,  fyndByEmail } = require('../usecases/verification.usecases');
const Users = require('../models/user.model');
const Company = require("../models/company.model")

/**
 * Controlador para enviar un código de verificación al correo del usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const sendCodeController = async (req, res) => {
    const { email } = req.body;

    try {
        // Busca el correo en el modelo Users
        let user = await Users.findOne({ email });

        // Si no se encuentra en Users, busca en el modelo Company
        if (!user) {
            user = await Company.findOne({ email });
        }

        // Si no se encuentra ni en Users ni en Company
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Determina el ID y el modelo para la referencia
        const userId = user._id;
        const userModel = user instanceof Users ? "User" : "Company";

        // Llama al caso de uso para enviar el código de verificación
        await sendVerificationCode(userId, email, userModel); // Asegúrate de que `sendVerificationCode` reciba `userModel` si es necesario

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

/**
 * Controlador para actualizar el estado de verificación a "true" para un usuario específico
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const updateVerifiedTrueController = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'El ID de usuario es requerido.' });
    }

    try {
        const updatedUser = await updateVerifiedTrue(userId);

        if (updatedUser) {
            return res.status(200).json({ message: 'El estado de verificación ha sido actualizado exitosamente.', user: updatedUser });
        }

        res.status(404).json({ message: 'Usuario no encontrado.' });
    } catch (error) {
        handleError(res, error, 'Hubo un error al actualizar el estado de verificación.');
    }
};


// Controlador que maneja la verificación del email en el contexto de login o creación de cuenta
async function checkEmailController(req, res) {
    const { email, context } = req.body; // Obtenemos el email y el contexto (login o createAccount) del request
    
    try {
        const result = await fyndByEmail(email); // Llamamos a la función fyndByEmail para verificar el correo

        // Dependiendo del contexto (login o createAccount), mostramos el mensaje apropiado
        if (context === 'crearAccount') {
            if (result.exists && result.verified) {
                return res.status(400).json({ message: 'Ya existe una cuenta con este correo registrado.' });
            } else if (result.exists && !result.verified) {
                return res.status(200).json({ message: 'Tu correo ya está registrado pero no has verificado, pulsa el botón para enviarte el código de verificación.' });
            } else {
                return res.status(200).json({ message: 'No se encontró ninguna cuenta con este correo, procede a crear una cuenta.' });
            }
        } else if (context === 'LogIn') {
            if (result.exists && result.verified) {
                return res.status(200).json({ message: 'Correo encontrado, procede con el inicio de sesión.' });
            } else if (result.exists && !result.verified) {
                return res.status(400).json({ message: 'Tu correo ya está registrado pero no has verificado. Por favor, verifica tu cuenta.' });
            } else {
                return res.status(400).json({ message: 'No se encontró ninguna cuenta con este correo.' });
            }
        }

        return res.status(400).json({ message: 'Contexto inválido.' });
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}




module.exports = {
    sendCodeController,
    verifyCodeController,
    updateVerifiedTrueController,
     checkEmailController
};
