const express = require('express');
const router = express.Router();
const { upload, uploadToS3 } = require('../lib/multerUPP');

router.post(
  '/uploadupp',
  upload.single('image'),
  uploadToS3,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const imageUrl = req.imageUrl;
      console.log('desde la ruta', imageUrl);

      return res
        .status(200)
        .json({ message: 'Imagen subida y guardada correctamente', imageUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }
  }
);

module.exports = router;
