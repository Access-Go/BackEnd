const express = require('express');
const router = express.Router();
const { upload, uploadToS3 } = require('../lib/multerCPP');  // Importa la configuración de multer-s3

// Ruta para subir la imagen y guardar la URL en el perfil del usuario
router.post('/uploadcpp', upload.single('image'), uploadToS3, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // La URL pública de la imagen que se acaba de subir
    const imageUrl = req.s3Data.Location;  // La URL está en la propiedad Location de la respuesta de S3

    // Retornamos la URL al cliente
    return res.status(200).json({ message: 'Imagen subida y guardada correctamente', imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

module.exports = router;
