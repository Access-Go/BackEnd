/**
 * --------------------------------------
 * Importamos las dependencias necesarias 
 * --------------------------------------
 */

require('dotenv').config();
const mongoose = require('mongoose');

/**
 * --------------------------------------
 * Destructuramos las variables de entorno necesarias
 * --------------------------------------
 */

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

/**
 * --------------------------------------
 * Creamos la URI de conexión a la base de datos
 * --------------------------------------
 */

const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;



/**
 * --------------------------------------
 * Función para conectar a la base de datos
 * --------------------------------------
 */

function connect () {
    return mongoose.connect(URI)
}

/**
 * --------------------------------------
 * Exportamos la función de conexión
 * --------------------------------------
 */

module.exports =  {connect} ;
