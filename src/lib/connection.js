/**
 * --------------------------------------
 * Importamos las dependencias necesarias 
 * --------------------------------------
 */

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

const url = `mongodb+srv://AccesGo:Accesibilidad.1@accessgo.gxajq.mongodb.net/`;
// const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

/**
 * --------------------------------------
 * Función para conectar a la base de datos
 * --------------------------------------
 */

const connect = () => mongoose.connect(url);

/**
 * --------------------------------------
 * Exportamos la función de conexión
 * --------------------------------------
 */

module.exports =  {connect} ;