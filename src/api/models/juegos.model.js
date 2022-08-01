//----Importamos mongoose para crear el modelo en la base de datos
const mongoose = require("mongoose");


//? CREACIÓN DEL ESQUEMA
//----Creamos nuestro esquema de juegos
//----Con sus campos titulo, desarrolladora, etc.
const juegosSchema = new mongoose.Schema({

    titulo: { type: String, trim: true, required: true },
    desarrolladora: { type: String, trim: true, required: true },
    precio: { type: Number, trim: true, required: true },
    año: { type: Number, trim: true, required: true },
    descripcion: { type: String, trim: true, required: true },
    caratula: { type: String, trim: true, required: true },
    categoria: { type: String, trim: true, required: true }

}, { timestamps: true, collection: 'juegos'});
//----Timestamps añadirá propiedades a nuestra base de datos que indican el momento en el que se ha creado el nuevo juego y collections se refiere al nombre de la colección de mongo que crearemos.

//----Llamamos Juego a nuestro modelo y le decimos que la colección va a ser juegos, y el esquema que vamos a utilizar va a ser juegosSchema creado anteriormente
const Juego = mongoose.model('juegos', juegosSchema);


//* EXPORTAMOS
//----Exportamos nuestro modelo de Juego
module.exports = Juego;