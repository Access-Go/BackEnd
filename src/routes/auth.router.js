const express = require("express")

const authUseCase = require("../usecases/auth.usecase")

const router = express.Router()

router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body
        const token = await authUseCase.login(email, password)

        response.json({
            success: true,
            data: { token },
        })
    } catch (error) {
        response.status(error.status || 500)
        response.json({
            error: error.message
        })
    }
})


module.exports = router