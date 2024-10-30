/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de usuario
 * -----------------------------------------------------------------
 */
const userUseCase = require('../usecases/user.usecases');
const RegisteredEmail = require('../models/registeredEmail.model.js');
const User = require('../models/user.model'); 
/**
 * -----------------------------------------------------------------
 * Controlador para crear usuario
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */

/**
 * Crear un usuario
 */
const createUser = async (request, response) => {
    try {
        const { email } = request.body;

        // Busca el correo en `RegisteredEmails`
        const emailExists = await RegisteredEmail.findOne({ email });
        if (emailExists) {
            return response.status(400).json({
                success: false,
                message: 'El correo ya está registrado.'
            });
        }

        // Crea el usuario y añade el correo a `RegisteredEmails`
        const userCreated = await User.create(request.body);
        await RegisteredEmail.create({ email });
        
        response.json({
            success: true,
            data: { user: userCreated }
        });
    } catch (error) {
        response.status(500).json({
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
const userById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('company'); // Usamos populate
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        res.json({ success: true, data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

const getUserCompanies = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('companies');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            data: { companies: user.companies }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */
module.exports = { createUser, userById, getAllUsers, updateUser, deleteUser, getUserCompanies };
