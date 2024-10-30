const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const auth = require("../middlewares/auth.middlewares"); // Asegúrate de tener la ruta correcta

const router = express.Router();

// Ruta de inicio de sesión
router.post("/", async (request, response) => {
    try {
        const { email, password } = request.body;
        const token = await authUseCase.login(email, password);
        
        console.log(token);

        response.json({
            success: true,
            data: { token },
        });
    } catch (error) {
        response.status(error.status || 500);
        response.json({
            error: error.message,
        });
    }
});

// Aplica el middleware a las rutas que necesitan autenticación
router.use(auth);

// Otras rutas protegidas aquí

module.exports = router;
