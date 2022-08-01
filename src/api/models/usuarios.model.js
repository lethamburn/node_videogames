//---- requerimos mongoose para crear el modelo 
const mongoose = require('mongoose');

//---- Traemos la librería bcrypt para "hashear" o encriptar la contraseña del usuario antes de que se registre
const bcrypt = require('bcrypt');


//? CREACIÓN DEL ESQUEMA
//---- Creamos nuestro esquema de usuarios
const userSchema = new mongoose.Schema({

    email: { type: String, trim: true, required: true, unique: true },
    nombreUsuario: { type: String, trim: true, required: true, unique: true },
    contraseña: { type: String, trim: true, required: true },
    añoNacimiento: { type: Number, trim: true, required: true },
    rol: { type: String, trim: true, required: true },
    imagenPerfil: { type: String, trim: true, required: true }

}, { timestamps: true, collection: 'users' });


//---- Antes de que se guarde nuestro esquema "presave", le decimos que nos encripte la contraseña
userSchema.pre("save", function (next) {

    //---- cogemos nuestra contraseña y le hacemos hashSync utilizando bcrypt, 10 será el número de veces que se encripta la contraseña antes de la definitiva.
        this.contraseña = bcrypt.hashSync(this.contraseña, 10);
        //---- next para que continue el guardado de mi esquema usuario en la base de datos y no se quede pendiente
        next();
    });


//---- creamos el modelo con la colección users y el esquema userSchema
const User = mongoose.model('users', userSchema);


//* EXPORTAMOS
//---- exportamos el modelo
module.exports = User;