const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Configuración del cliente S3
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

// Ruta para eliminar una imagen
router.delete('/deleteacc', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // Extraer el `key` de la URL
    const bucketUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/`;
    if (!url.startsWith(bucketUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    const key = url.replace(bucketUrl, ''); // Elimina el prefijo del bucket

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

module.exports = router;
