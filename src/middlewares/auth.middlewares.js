const createError = require("http-errors")
const authUsecase = require("../usecases/auth.usecase")
const jwt = require("../lib/jwt")

async function auth(request, response, next) {
    try {
        const token = request.headers.authorization

        if (!token) {
            throw createError(401, "JWT is required")
        }

        const payload = jwt.verify(token)
        const user = await authUsecase.getById(payload.id)

        request.user = user

        next()
    } catch (error) {
        response.status(401)
        response.json({
            success: false,
            error: error.message
        })
        
    }
}

module.exports = auth