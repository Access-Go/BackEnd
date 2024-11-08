const crypto = require('crypto');
const Verification = require('../models/verification');
const sendEmail = require('../utils/sendEmail.js'); // Función para enviar correos
const User = require('../models/user.model.js')
const Company = require("../models/company.model.js")


/**
 * Genera un código de verificación de 6 dígitos
 * @returns {String} Código de verificación
 */
function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex'); // Código de 6 caracteres alfanuméricos
}

/**
 * Envía un código de verificación al correo del usuario
 * @param {ObjectId} userId El ID del usuario
 * @param {String} email El correo electrónico del usuario
 * @returns {Promise<void>}
 */
async function sendVerificationCode(userId, email) {
    // Revoca cualquier código de verificación pendiente
    await revokePendingCodes(userId);

    // Genera un nuevo código
    const verificationCode = generateVerificationCode();

    // Guarda el nuevo código en la base de datos
    const newVerification = new Verification({
        userId,
        code: verificationCode,
        expiresAt: Date.now() + 3600000 // 1 hora
    });

    await newVerification.save();

    // Envía el código al correo del usuario
    await sendEmail({
        to: email,
        subject: 'Verifica tu cuenta - AccessGo',
        text: `Tu código de verificación es: ${verificationCode}. Válido por 1 hora.`
    });
}

/**
 * Verifica si el código proporcionado es válido
 * @param {ObjectId} userId El ID del usuario
 * @param {String} code El código de verificación proporcionado por el usuario
 * @returns {Promise<boolean>} Verdadero si el código es válido, falso si no
 */

async function verifyUserCode(userId, code) {
    const verification = await Verification.findOne({ userId, code });
    
    if (!verification) {
        console.log('No se encontró el código de verificación.');
        return false;
    }

    if (verification.expiresAt < Date.now()) {
        console.log('El código ha expirado.');
        return false;
    }

    // Elimina el código verificado
    await Verification.deleteOne({ _id: verification._id });

   

    return true;
}

async function updateVerifiedTrue(userId) {
    // Intenta encontrar y actualizar en User
    let updatedUser = await User.findByIdAndUpdate(
        userId, 
        { verified: true }, 
        { new: true } // Devuelve el documento actualizado
    );

    // Si no se encontró en User, busca en Company
    if (!updatedUser) {
        updatedUser = await Company.findByIdAndUpdate(
            userId, 
            { verified: true }, 
            { new: true }
        );
    }

    return updatedUser; // Retorna el documento actualizado o null si no se encontró en ninguno
}

async function fyndByEmail(email, context) {
    try {
        // Busca en el modelo User por el email
        let user = await User.findOne({ email: email });

        // Si no se encuentra en User, busca en Company
        if (!user) {
            user = await Company.findOne({ email: email });
        }

        // Si no se encuentra un usuario ni en User ni en Company
        if (!user) {
            // Si está en login y no encuentra el correo
            if (context === 'LogIn') {
                return { exists: false, message: 'El correo no está registrado. Por favor crea una cuenta.' };
            }
            // Si está en createAccount y no encuentra el correo
            return { exists: false, message: 'Puedes crear una cuenta con este correo.' };
        }

        // Si el usuario o compañía está verificado
        if (user.verified) {
            if (context === 'LogIn') {
                return { exists: true, verified: true, message: 'Correo encontrado. Inicia sesión.' };
            }
            return { exists: true, verified: true, message: 'Ya existe una cuenta con este correo registrado.' };
        }

        // Si el usuario o compañía no está verificado
        if (context === 'LogIn') {
            return { exists: true, verified: false, message: 'Tu cuenta no está verificada. Por favor verifica tu correo.' };
        }

        return { exists: true, verified: false, message: 'Tu correo ya está registrado pero no has verificado. Pulsa el botón para enviarte el código de verificación.' };

    } catch (error) {
        console.error('Error al buscar el correo:', error);
        return { exists: false, message: 'Hubo un error al buscar el correo.' };
    }
}


/**
 * Revoca cualquier código de verificación pendiente si es necesario
 * @param {ObjectId} userId El ID del usuario
 * @returns {Promise<void>}
 */
async function revokePendingCodes(userId) {
    await Verification.deleteMany({ userId });
}


module.exports = {
    sendVerificationCode,
    verifyUserCode,
    updateVerifiedTrue,
    fyndByEmail,
    revokePendingCodes
};
