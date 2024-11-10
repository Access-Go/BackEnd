const multer = require('multer');  // Importa multer
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');  // Usamos AWS SDK v3
const s3 = require('./aws');  // Cliente de S3 que ya configuramos

// Configuración de multer para almacenar archivos en memoria (por ejemplo, puedes usar storage en disco si prefieres)
const storage = multer.memoryStorage();  // Usamos memoria para almacenar los archivos temporalmente

// Configuración de multer con el almacenamiento en memoria
const upload = multer({
  storage: storage,  // Usamos almacenamiento en memoria
  limits: { fileSize: 50 * 1024 * 1024 },  // Limitar el tamaño máximo del archivo (50MB en este caso)
});

// Función para subir el archivo a S3
const uploadToS3 = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const userId = req.body.userId;  // Suponemos que el userId se pasa en el cuerpo
  
  // Obtener la extensión del archivo a partir del tipo MIME
  const fileExtension = req.file.mimetype.split('/')[1];  // Ejemplo: 'image/jpeg' -> 'jpeg'

  // Generar un nombre único para el archivo
  const fileName = `${userId}/${Date.now()}.${fileExtension}`;  // Nombre único del archivo

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,  // Nombre del bucket de S3
    Key: fileName,  // Nombre del archivo en S3
    Body: req.file.buffer,  // El archivo en memoria (buffer)
    ACL: 'public-read',  // Acceso público
    ContentType: req.file.mimetype,  // Especificar el tipo MIME del archivo
  };

  try {
    // Subir el archivo a S3 usando el comando PutObjectCommand
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);  // Subir el archivo a S3
    console.log('Archivo subido con éxito:', data);
    req.s3Data = data;  // Guardamos la respuesta de S3 en la solicitud
    next();  // Continuar al siguiente middleware
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error al subir el archivo a S3');
  }
};

module.exports = { upload, uploadToS3 };
