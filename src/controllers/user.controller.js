/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de usuario
 * -----------------------------------------------------------------
 */
const userUseCase = require('../usecases/user.usecases');

/**
 * -----------------------------------------------------------------
 * Controlador para crear usuario
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const createUser = async (request, response) => {
    try {
        const userCreated = await userUseCase.create(request.body);
        response.json({
            success: true,
            data: { user: userCreated }
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * -----------------------------------------------------------------
 * Controlador para buscar usuario por Id
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const userById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await userUseCase.getById(id);

        if (!user) {
            response.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        response.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * -----------------------------------------------------------------
 * Controlador para obtener todos los usuarios
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const getAllUsers = async (req, res) => {
  try {
      const users = await userUseCase.getAll();
      const usersWithoutSensitiveData = users.map(user => {
          const { password, ...userWithoutPassword } = user.toObject();
          return userWithoutPassword;
      });
      res.json({
          success: true,
          data: { users: usersWithoutSensitiveData }
      });
  } catch (error) {
      res.status(error.status || 500).json({
          success: false,
          error: error.message
      });
  }
};

/**
 * -----------------------------------------------------------------
 * Controlador para actualizar usuario por Id
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const updateUser = async (request, response) => {
    try {
        const { id } = request.params;
        const updatedUser = await userUseCase.update(id, request.body);

        if (!updatedUser) {
            response.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        response.json({
            success: true,
            data: { user: updatedUser }
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * -----------------------------------------------------------------
 * Controlador para eliminar usuario por Id
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const deleteUser = async (request, response) => {
    try {
        const { id } = request.params;
        const deletedUser = await userUseCase.delete(id);

        if (!deletedUser) {
            response.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        response.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */
module.exports = { createUser, userById, getAllUsers, updateUser, deleteUser };
