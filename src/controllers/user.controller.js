/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de usuario
 * -----------------------------------------------------------------
 */
const userUseCase = require('../usecases/user.usecases');
const RegisteredEmail = require('../models/registeredEmail.model.js');
const User = require('../models/user.model'); 
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

const upload = multer({ storage: storage });

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

        // Verifica si el correo ya está registrado
        const emailExists = await RegisteredEmail.findOne({ email });
        if (emailExists) {
            return response.status(400).json({
                success: false,
                message: 'El correo ya está registrado.'
            });
        }

        // Agrega la ruta de la imagen si se proporciona
        const userData = {
            ...request.body,
            profilePicture: request.file ? `/uploads/${request.file.filename}` : null
        };

        // Crea el usuario y añade el correo a `RegisteredEmails`
        const userCreated = await userUseCase.create(userData);
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
 * Controlador para buscar usuario por correo electrónico
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */

const getUserByEmailHandler = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el correo esté en el cuerpo de la solicitud
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un correo electrónico válido',
            });
        }

        // Buscar el usuario por su correo
        const user = await userUseCase.getUserByEmail(email);

        return res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        const statusCode = error.message.includes('No se encontró') ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            error: error.message,
        });
    }
};


/**
 * Cambiar la contraseña del usuario
 * @param {String} id - ID del usuario
 * @param {String} newPassword - Nueva contraseña proporcionada por el usuario
 */
const changePassword = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { newPassword } = req.body; // Nueva contraseña

    try {
        // Buscar al usuario por ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Validar la nueva contraseña (ejemplo: mínimo 6 caracteres)
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */
module.exports = { createUser, userById, getAllUsers, updateUser, deleteUser, getUserCompanies, getUserByEmailHandler, changePassword};