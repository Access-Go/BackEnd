const multer = require('multer');  // Importa multer
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');  // Usamos AWS SDK v3
const s3 = require('./aws');  // Cliente de S3 que ya configuramos
const multerS3 = require('multer-s3');
const User = require('../models/user.model');  // Asegúrate de tener tu modelo de usuario importado

const deleteOldProfilePictures = async (userId, currentImageKey) => {
  try {
    // 1. Listar todos los objetos de la carpeta del usuario en S3 (si las imágenes están organizadas en una carpeta con el ID del usuario)
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,  // Tu nombre de bucket
      Prefix: `${userId}/`,  // Si las imágenes están organizadas por userId, esto las filtra
    };
    
    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await s3.send(listCommand);

    // 2. Filtrar las imágenes que no sean la actual y que sean antiguas
    const imagesToDelete = listResponse.Contents.filter((item) => item.Key !== currentImageKey)
      .map((item) => ({ Key: item.Key }));

    // 3. Eliminar las imágenes antiguas
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

// Configuración de multer para almacenar archivos en memoria (por ejemplo, puedes usar storage en disco si prefieres)
const storage = multer.memoryStorage();  // Usamos memoria para almacenar los archivos temporalmente

// Configuración de multer con el almacenamiento en memoria
const upload = multer({
  storage: storage,  // Usamos almacenamiento en memoria
  limits: { fileSize: 50 * 1024 * 1024 },  // Limitar el tamaño máximo del archivo (50MB en este caso)
});

// Función para subir el archivo a S3 y guardar la URL en el esquema de usuario
const uploadToS3 = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const userId = req.body.userId;  // Suponemos que el userId se pasa en el cuerpo
  const fileName = `${userId}/${Date.now()}.jpg`;  // Nombre único del archivo (puedes usar el tipo de archivo real si lo tienes)

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,  // Nombre del bucket de S3
    Key: fileName,  // Nombre del archivo en S3
    Body: req.file.buffer,  // El archivo en memoria (buffer)
    ACL: 'public-read',  // Acceso público
    ContentType: req.file.mimetype,  // Contenido según el tipo de archivo
  };

  try {
    // Subir archivo a S3
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);  // Subir el archivo a S3
    console.log('Archivo subido con éxito:', data);

    await deleteOldProfilePictures(userId, fileName);

    // Crear la URL pública de la imagen en S3
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    // Guardar la URL de la imagen en el esquema de usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Guardamos la URL de la imagen en el campo profilePicture del usuario
    user.profilePicture = imageUrl;
    await user.save();  // Guardamos el usuario actualizado

    // Añadir la URL de la imagen al objeto de solicitud para acceder más tarde
    req.s3Data = data;  // Guardamos la respuesta de S3 en la solicitud

    next();  // Continuar al siguiente middleware
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error al subir el archivo a S3');
  }
};

module.exports = { upload, uploadToS3 };
