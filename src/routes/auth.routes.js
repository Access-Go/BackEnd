const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const auth = require("../middlewares/auth.middlewares");

const router = express.Router();

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

router.use(auth);

module.exports = router;
