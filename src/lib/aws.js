const { S3Client } = require('@aws-sdk/client-s3'); // Usamos require para importar el cliente de S3

// Configuración del cliente
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

module.exports = s3; // Exportamos el cliente para que otros archivos puedan usarlo