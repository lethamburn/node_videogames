//----Importamos dotenv para poder acceder a mis variables de entorno ocultas
const dotenv = require("dotenv");
//----Configuramos dotenv para poder acceder al archivo .env
dotenv.config();
//----Requerimos mongoose para conectarnos con MONGO.
const mongoose = require("mongoose");

//----Recuperamos la URI de Mongo de nuestro archivo .env
const mongoDB = process.env.MONGO_DB;

//----Creamos la función asíncrona que conectará nuestro servidor con la base de datos de MONGO
const connect = async () => {
  //----Intentamos conectarnos:
  try {
    //----El primer param de la función connect es donde quiero conectar
    //----El segundo param es un objeto que parseará nuestra URI recuperada de .env y mantendrá estable la conexión.
    const db = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //----Con destructuring puedo sacar el nombre de la base de datos y el host en el que está
    const { name, host } = db.connection;
    console.log(`Conectado a la base de datos : ${name} en el host: ${host}`);
  } catch (error) {
    console.error(`No se ha podido realizar la conexión con la base de datos`);
  }
};

//----Exportamos la función para poder usarla en nuestro index.js
module.exports = {connect}