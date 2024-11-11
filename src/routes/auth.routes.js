const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const auth = require("../middlewares/auth.middlewares");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API para autenticación de usuarios
 */

/**
 * --------------------------------------
 * Ruta para iniciar sesión
 * --------------------------------------
 */
/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token de autenticación
 *                     type:
 *                       type: string
 *                       description: Tipo de usuario (e.g., "user" o "company")
 *                     id:
 *                       type: string
 *                       description: ID del usuario autenticado
 *                     cuenta:
 *                       type: object
 *                       description: Datos adicionales si el usuario es una compañía
 *                       properties:
 *                         companyId:
 *                           type: string
 *                           description: ID de la compañía
 *       '401':
 *         description: Datos inválidos o credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Invalid data"
 */
router.post("/", async (request, response) => {
    try {
        const { email, password } = request.body;

        // Obtener token, type, id, y cuenta (si es compañía) del resultado de login
        const { token, type, id, cuenta } = await authUseCase.login(email, password);

        // Responder con `cuenta` solo si está disponible
        const responseData = { token, type, id };
        if (cuenta) {
            responseData.cuenta = cuenta;
        }

        response.json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        response.status(401).json({
            success: false,
            error: error.message || 'Invalid data',
        });
    }
});

// Middleware para autenticar rutas posteriores
router.use(auth);

module.exports = router;
