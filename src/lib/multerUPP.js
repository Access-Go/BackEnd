const multer = require('multer');  
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');  // Usamos AWS SDK v3
const s3 = require('./aws'); 
const multerS3 = require('multer-s3');
const User = require('../models/user.model');  

const deleteOldProfilePictures = async (userId, currentImageKey) => {
  try {
    
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,  
      Prefix: `${userId}/`,  
    };
    
    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await s3.send(listCommand);

    
    const imagesToDelete = listResponse.Contents.filter((item) => item.Key !== currentImageKey)
      .map((item) => ({ Key: item.Key }));

    
    if (imagesToDelete.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: {
          Objects: imagesToDelete,
        },
      };

      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      const deleteResponse = await s3.send(deleteCommand);
      console.log('Imágenes eliminadas exitosamente:', deleteResponse);
    }
  } catch (error) {
    console.error('Error al eliminar imágenes antiguas:', error);
  }
};


const storage = multer.memoryStorage();  


const upload = multer({
  storage: storage,  
  limits: { fileSize: 50 * 1024 * 1024 }, 
});


const uploadToS3 = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const userId = req.body.userId;  
  const fileName = `${userId}/${Date.now()}.jpg`;  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,  
    Key: fileName,  
    Body: req.file.buffer,  
    ACL: 'public-read',  
    ContentType: req.file.mimetype,  
  };

  try {
    
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);  
    console.log('Archivo subido con éxito:', data);

    await deleteOldProfilePictures(userId, fileName);

    
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    
    user.profilePicture = imageUrl;
    await user.save();  

    
    req.s3Data = data;  

    next();  
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error al subir el archivo a S3');
  }
};

module.exports = { upload, uploadToS3 };
