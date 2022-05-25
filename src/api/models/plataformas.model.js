//---- Se requiere mongoose para crear nuestro esquema
const mongoose = require("mongoose");


//? CREACIÓN DEL ESQUEMA
//---- Creamos el esquema de nuestras plataformas
const plataformaSchema = new mongoose.Schema({

    name: { type: String, trim: true, required: true },
    logo: { type: String, trim: true, required: true },
    año: { type: Number, trim: true, required: true },
    empresa: { type: String, trim: true, required: true },
    juegos: { type: mongoose.Schema.Types.ObjectId, ref: 'juegos', trim: true }

}, { timestamps: true, collection: 'plataformas' });

//---- llamamos Plataforma a nuestro modelo y le indicamos que será de la coleccion plataformas y que el esquema que va a utilizar es plataformaSchema
const Plataforma = mongoose.model('plataformas', plataformaSchema);


//* EXPORTAMOS
// exportamos nuestro esquema
module.exports = Plataforma;

