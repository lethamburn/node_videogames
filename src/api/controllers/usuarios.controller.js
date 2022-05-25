//---- Traaemos al controlador nuestro modelo de usuario
const User = require('../models/usuarios.model');
//---- Requerimos la librería bcryp para encriptar la contraseña
const bcrypt = require('bcrypt');

const { generateSign, verifyJwt } = require('../../utils/jwtUtils')


//! ----CREATE
//---- para crear un usuario vamos a hacer un post - nuestra función de post será asíncrona puesto que tardará un tiempo en postear un nuevo usuario a nuestra base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir)
const postNewUser = async (req, res, next) => {
        
    //---- Creamos un tryCatch para intentar postear el nuevo usuario y si no funciona nos devolverá el catch
    try {
        //---- Creamos una constante newUser, le decimos que será un nuevo Usuario, con lo cual comprobará si coincide con los campos del modelo del usuario, si no coincide nos dará error. Y cuando coincida recogerá el req.body. o lo que es lo mismo el cuerpo de nuestra reques o petición.
        const newUser = new User(req.body);
        
        //---- Comprobamos en la BBDD que nuestro email no esté duplicado
        const userDuplicate = await User.findOne({email: newUser.email});
        
        //---- Comprobamos si el usuario está duplicado, si lo está devolvemos un error diciendo que el usuario ya está registrado.
        if(userDuplicate){
            return next('Usuario ya registrado');
        }

        //---- Aquí comprobamos si nos viene un fichero (file) en la request(req) o petición.
        if (req.file) {
            //---- en el caso de que venga su ruta se añadirá a el campo imagenPerfil de nuestro nuevo usuario
            newUser.imagenPerfil = req.file.path;
        }

        //---- En este punto guardaremos nuestro nuevo usuario en la base de datos.
        const userDB = await newUser.save();

        //---- Cuando se haya guardado la función nos devolverá (return) una respuesta (res) con el status(201) y nuestro usuario de la base de datos creado y parseado a json para que podamos verlo correctamente.
        return res.status(201).json(userDB);
    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
        return next(error)
    }
}


//! ----LOGIN
//---- para loguear un usuario vamos a hacer un post - nuestra función de post será asíncrona puesto que tardará un tiempo en postear un nuevo usuario a nuestra base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir)
const loginUser = async (req, res, next) => {
    
    //---- Creamos un tryCatch para intentar loguear el usuario y si no funciona nos devolverá el catch
    try {

        //---- Buscamos el usuario por email en la BBDD
        const userDB = await User.findOne({email: req.body.email});

        //---- Si el usuario no existe devolvemos error diciendo que no existe
        if(!userDB){
            return next('Usuario no registrado');
        }

        //---- comprobamos que la contraseña del usuario coincide con la que tenemos hasheada en nuestra BBDD
        if (bcrypt.compareSync(req.body.contraseña, userDB.contraseña)) {

            //---- Generamos el token para nuestro usuario registrado
            const token = generateSign(userDB._id, userDB.email);
                    
            //---- Cuando se haya logueado la función nos devolverá (return) una respuesta (res) con el status(200) y nuestro token.
            return res.status(200).json(token);
        }else{
            //---- Si la contraseña no existe devolvemos error diciendo que no existe
            return next('La contraseña no coincide');
        }
    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
        return next(error);
    }
}


//! ----LOGOUT
//---- para hacer un logout un usuario vamos a hacer un post - nuestra función de post será asíncrona puesto que tardará un tiempo en postear un nuevo usuario a nuestra base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir)
const logOut = async (req, res, next) => {
    
    //---- Creamos un tryCatch para intentar postear el nuevo usuario y si no funciona nos devolverá el catch
    try {
        //---- Ponemos el token a null cuando nos deslogueamos
        const token = null;
        
        //---- Cuando se haya deslogueado la función nos devolverá (return) una respuesta (res) con el status(200) y nuestro token a null.
        return res.status(200).json(token)
    } catch (error) {        
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
        return next(error)        
    }
}


//! ----READ
//---- Crearemos una función para recoger un solo usuario según su id de mi base de datos.
const getUser = async (req, res, next) => {   
    
    //---- hacemos el try catch para intentar recoger el usuario y si no lo consigue entrará por el catch
    try {        
        
        //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
        const { id } = req.params;

        //---- Ahora realizaremos una búsqueda por id, el id lo tenemos guardado en nuestra variable id, y utilizamos la función findById de nuestro modelo de la base de datos.
        const userDB = await User.findById(id);

        //---- Comprobamos si lo ha encontrado o no, si no lo encuentra no entra dentro del if (que nos devolverá un error de que no ha encontrado el juego en la base de datos) y si lo encuentra sigue.
        if (!userDB) {
            return next("Usuario no encontrado");
        }

        //---- al encontrarlo lo retornamos como respuesta como hemos hecho anteriormente
        return res.status(200).json({ name: userDB.nombreUsuario, email: userDB.email })
    } catch (error) {
         //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
        return next(error);
    }
}

//* EXPORTAMOS
//---- Para finalizar nuestro controlador exportamos todas nuestras funciones
module.exports = {
    postNewUser, loginUser, logOut, getUser
}

