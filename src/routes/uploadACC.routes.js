const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const dotenv = require('dotenv');



dotenv.config();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  }
});

router.post('/uploadacc', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { userId } = req.body; 
  const fileName = `accimg/${userId}/${Date.now()}-${req.file.originalname}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    const data = await s3.send(command);
    res.json({ message: 'File uploaded successfully', url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});




module.exports = router;
