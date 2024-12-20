const multer = require('multer');  
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');  // Usamos AWS SDK v3
const s3 = require('./aws'); 
const multerS3 = require('multer-s3');
const User = require('../models/user.model');  


const deleteACC = async (userId, currentImageKey) => {
    try {
      
      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,  
        Prefix: `accimg/${userId}/${currentImageKey}`,  
      };
      
      const listCommand = new ListObjectsV2Command(listParams);
      const listResponse = await s3.send(listCommand);
  
      
      const imagesToDelete = listResponse.Contents.filter((item) => item.Key !== currentImageKey)
        .map((item) => ({ Key: item.Key }));
  
      
      if (imagesToDelete.length) {
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

  module.exports = { deleteACC };