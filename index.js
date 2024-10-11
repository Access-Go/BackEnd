/**
 * -----------------------------------------------------------------
 * Importamos dotenv para cargar variables de entorno
 * -----------------------------------------------------------------
 */

require('dotenv').config();

/**
 * -----------------------------------------------------------------
 * Importamos el servidor Express
 * -----------------------------------------------------------------
 */

const server = require('./src/server');

/**
 * -----------------------------------------------------------------
 * Importamos la función de conexión a la base de datos
 * -----------------------------------------------------------------
 */

const db = require('./src/lib/connection');

/**
 * -----------------------------------------------------------------
 * Definimos el puerto en el que se ejecutará el servidor
 * -----------------------------------------------------------------
 */

const PORT = process.env.PORT || 8080;

/**
 * -----------------------------------------------------------------
 * Conectamos a la base de datos y arrancamos el servidor
 * -----------------------------------------------------------------
 */

db.connect()
    .then(() => {
        // Mensaje de éxito de conexión a la base de datos
        console.log('DB Connected');
        server.listen(PORT, () => {
            // Mensaje de éxito de inicio del servidor
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        // Mensaje de error en la conexión a la base de datos
        console.error('DB Connection Failed: ', error);
    });