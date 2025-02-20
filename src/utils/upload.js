const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const blob = bucket.file(`promos/${Date.now()}_${originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.on('error', (error) => reject(error));
    blobStream.end(buffer);
  });
}

module.exports = { uploadImage };
