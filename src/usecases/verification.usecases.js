const crypto = require('crypto');
const Verification = require('../models/verification');
const sendEmail = require('../utils/sendEmail.js'); // Función para enviar correos

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
    revokePendingCodes
};
