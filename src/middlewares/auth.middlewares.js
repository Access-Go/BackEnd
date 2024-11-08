const createError = require("http-errors");
const authUsecase = require("../usecases/auth.usecase");
const jwt = require("../lib/jwt");

async function auth(request, response, next) {
    // Si la ruta es la de inicio de sesión, no se necesita autenticación
    if (request.path === '/api/auth' && request.method === 'POST') {
        return next(); // Permite el acceso sin token
    }

    try {
        const token = request.headers.authorization;

        if (!token) {
            throw createError(401, "JWT is required");
        }

        const payload = jwt.verify(token);
        if (!payload || !payload.id) {
            throw createError(401, "Invalid JWT");
        }

        const user = await authUsecase.getById(payload.id);
        if (!user) {
            throw createError(401, "User not found");
        }

        request.user = user;

        next();
    } catch (error) {
        response.status(error.status || 401);
        response.json({
            success: false,
            error: error.message,
        });
    }
}

module.exports = auth;