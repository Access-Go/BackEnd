// routes/upload.js
const express = require('express');
const router = express.Router();
const { upload, uploadToS3 } = require('../lib/multer');  // Importa la configuración de multer
const mongoose = require('mongoose');
const User = require('../models/user.model');  // Asegúrate de tener un modelo de usuario si lo necesitas

// Ruta para subir imágenes
router.post('/upload', upload.single('image'), uploadToS3, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // La URL pública de la imagen que se acaba de subir
    const imageUrl = req.s3Data.Location;  // Usar req.s3Data para obtener la URL subida

    // Obtener el userId del body de la solicitud
    const userId = req.body.userId;

    // Buscar al usuario en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Guardar la URL de la imagen en el modelo de usuario
    user.image = imageUrl;
    await user.save();

    return res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error uploading image' });
  }
});

module.exports = router;

