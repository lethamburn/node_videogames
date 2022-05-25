
//---- Nos traemos el modelo del usuario puesto que las comprobaciones las haremos accediendo a estos datos
const User = require("../api/models/usuarios.model");

//---- nos traemos la verificación de nuestro jwt
const { verifyJwt } = require("../utils/jwtUtils");

//---- Creamos una función para verificar si es un administrador o no. 
const isAdmin = async (req, res, next) => {

    //---- try catch para comprobar el funcionamiento de nuestro código como siempre
    try {

        //---- cogemos el token de la autorización de las headers de la petición
        const token = req.headers.authorization;

        //---- si no tiene token no está autorizado
        if (!token) {
        return next("Unauthorized");
        }

        //---- sustituimos de nuestro token el Bearer " " para quedarnos con el token puramente ya que es texto que nos sobra
        const parsedToken = token.replace("Bearer ", "");

        //---- validamos el token parseado con la clave secreta de jwt que tendremos en nuestro .env (una palabra secreta)
        const validToken = verifyJwt(parsedToken, process.env.JWT_SECRET);

        //---- encontramos nuestro usuario logueado buscando en el modelo por su id del token, que será su mismo id
        const userLogued = await User.findById(validToken.id);

        //---- Haremos la comprobación de si su rol es administrador o no
        if (userLogued.rol === "admin") {
            
            //---- si llegamos hasta aquí es administrador con lo cual pondremos su contraseña en null para que no se filtre información sensible...
            userLogued.password = null;
            //---- asignaremos al cuerpo de la petición el usuario logeado
            req.user = userLogued;
            //---- y le diremos a nuestra función que "abra la puerta"
            next();

        } else {
            //---- si entra en el else significa que no eres admin 
            return next("no eres admin");
        }

    } catch (error) {
        //---- ha fallado nuestra función con lo cual hay algo mal hecho
        return next(error);
    }
};

//---- Creamos una función para verificar si está registrado o no, por lo que tanto si su rol es admin como si es user pasará la validación, pero un usuario que esté viendo nuestra página y no esté registrado y logeado no podrá acceder a nuestra ruta 
const isRegistered = async (req, res, next) => {

    //---- try catch para comprobar el funcionamiento de nuestro código como siempre
    try {

        //---- cogemos el token de la autorización de las headers de la petición
        const token = req.headers.authorization;

        //---- si no tiene token no está autorizado
        if (!token) {
        return next("Unauthorized");
        }

        //---- sustituimos de nuestro token el Bearer " " para quedarnos con el token puramente ya que es texto que nos sobra
        const parsedToken = token.replace("Bearer ", "");

        //---- validamos el token parseado con la clave secreta de jwt que tendremos en nuestro .env (una palabra secreta)
        const validToken = verifyJwt(parsedToken, process.env.JWT_SECRET);

        //---- encontramos nuestro usuario logueado buscando en el modelo por su id del token, que será su mismo id
        const userLogued = await User.findById(validToken.id);
        
        //---- pondremos su contraseña en null para que no se filtre información sensible...
        userLogued.password = null;
        //---- asignaremos al cuerpo de la petición el usuario logeado
        req.user = userLogued;
        //---- y le diremos a nuestra función que "abra la puerta"
        next();

    } catch (error) {
        //---- ha fallado nuestra función con lo cual hay algo mal hecho
        return next(error);
    }
};

//* EXPORTAMOS
//---- exportamos nuestras funciones para poder acceder a ellas y que hagan su "trabajo" de comprobación de roles en las rutas en las que lo necesitemos
module.exports = { isAdmin, isRegistered };