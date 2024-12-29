const express = require('express');
const router = express.Router();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  }
});

router.get('/profilepicture/:userId', async (req, res) => {
  const { userId } = req.params;

  // Aseguramos que 'userId' esté disponible
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Asegúrate de que el prefijo es el correcto y formatea la URL correctamente
    const prefix = `profpic/${userId}/`;
    console.log(`Fetching images with Prefix: ${prefix}`);

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: prefix, // Prefix que buscamos bajo el userId
    });

    const data = await s3.send(command);

    // Verifica que 'data.Contents' existe y tiene elementos
    if (!data || !data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No images found for this user' });
    }

    // Si 'Contents' contiene imágenes, las mapeamos a URLs públicas
    const imageUrl = data.Contents.map(item => {
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`;
    });

    res.json(imageUrl); // Devolvemos las URLs de las imágenes
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    res.status(500).json({ error: 'Error fetching images from S3', details: error.message });
  }
});

module.exports = router;