const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const auth = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        const { email, password } = request.body;
        const token = await authUseCase.login(email, password);

        response.json({
            success: true,
            data: { token },
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