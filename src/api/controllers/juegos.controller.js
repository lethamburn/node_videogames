//---- Traemos al controlador nuestro modelo de juego
const Juego = require('../models/juegos.model');

//---- traemos nuestra función deleteFile de nuestro middlewares para eliminar los ficheros en cloudinary
const { deleteFile } = require('../../middlewares/deleteFile');


//---- Aquí crearemos nuestro CRUD... create, read, update y delete

//! ----CREATE
//---- para crear un juego vamos a hacer un post - nuestra función de post será asíncrona puesto que tardará un tiempo en postear un nuevo juego a nuestra base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);
const postJuego = async (req, res, next) => {

    //---- Creamos un tryCatch para intentar postear el nuevo juego y si no funciona nos devolverá el catch
    try {
        
        //---- Creamos una constante newJuego, le decimos que será un nuevo Juego, con lo cual comprobará si coincide con los campos del modelo del juego, si no coincide nos dará error. Y cuando coincida recogerá el req.body. o lo que es lo mismo el cuerpo de nuestra reques o petición.
        const newJuego = new Juego(req.body);

        //---- Aquí comprobamos si nos viene un fichero (file) en la request(req) o petición.
        if (req.file) {
            //---- en el caso de que venga su ruta se añadirá a el campo carátula de nuestro nuevo juego
            newJuego.caratula = req.file.path;
        }

        //---- En este punto guardaremos nuestro nuevo juego en la base de datos.
        const juegoDB = await newJuego.save();

        //---- Cuando se haya guardado la función nos devolverá (return) una respuesta (res) con el status(201) y nuestro juego de la base de datos creado y parseado a json para que podamos verlo correctamente.
        return res.status(201).json(juegoDB);

    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
        return next("No se ha podido crear un juego", error)
    }

}


//! ----READ
//---- para leer un juego vamos a hacer un get, o varios - nuestras funciones get serán asíncronas puesto que tardará un tiempo en recoger los datos de la base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para recoger todos los juegos de mi base de datos, en este caso no vamos a utilizar la request, aunque al crear la función la pongo porque si no se nos guardaría la request en response y nos podría llegar a crear confusión.
const getJuegos = async (req, res, next) => {

    //---- hacemos el try catch para intentar recoger los juegos y si no lo consigue entrará por el catch
    try {

        //---- Haremos un .find() en el modelo de Juego que nos recogerá todos los juegos y los guardaremos en allJuegosDB
        const allJuegosDB = await Juego.find();

        //---- nuestra función nos devuelve (return) la respuesta (res) de nuestra función por lo tanto será un status(200) con nuestros juegos parseados a json
        return res.status(200).json(allJuegosDB);
        
    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
        return next("No se han podido solicitar los juegos a la base de datos", error)
    }

}


//---- Crearemos una función para recoger un solo juego según su id de mi base de datos.
const getJuegoById = async (req, res, next) => {

    //---- hacemos el try catch para intentar recoger el juego y si no lo consigue entrará por el catch
    try {

        //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
        const { id } = req.params;

        //---- Ahora realizaremos una búsqueda por id, el id lo tenemos guardado en nuestra variable id, y utilizamos la función findById de nuestro modelo de la base de datos.
        const juegoDB = await Juego.findById(id);

        //---- Comprobamos si lo ha encontrado o no, si no lo encuentra no entra dentro del if (que nos devolverá un error de que no ha encontrado el juego en la base de datos) y si lo encuentra sigue.
        if (!juegoDB) {
            return next("No se encuentra la unidad de juego a la que usted está tratando de dar búsqueda.")
        }

        //---- al encontrarlo lo retornamos como respuesta como hemos hecho anteriormente
        return res.status(200).json(juegoDB);
        
    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
        return next("La función getJuego ha fallado.")
    }

}


//---- Crearemos una función para recoger un solo juego según su título de mi base de datos.

const getJuegoByTitulo = async (req, res, next) => {

    //---- hacemos el try catch para intentar recoger el juego y si no lo consigue entrará por el catch
    try {

        //---- recogeremos el titulo por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro titulo.
        const { titulo } = req.params;

        //---- Ahora realizaremos una búsqueda por titulo, el titulo lo tenemos guardado en nuestra variable titulo, y utilizamos la función find de nuestro modelo de la base de datos.
        //---- a diferencia del id que utilizábamos una función findById, como nuestra función find, no sabe sobre que tiene que buscar se lo tendremos que indicar, busca por titulo con los datos que tengo guardados en mi variable titulo.
        const juegoDB = await Juego.find({titulo: titulo});

        //---- Comprobamos si lo ha encontrado o no, si no lo encuentra no entra dentro del if (que nos devolverá un error de que no ha encontrado el juego en la base de datos) y si lo encuentra sigue.
        if (!juegoDB) {
            return next("No se encuentra la unidad de juego a la que usted está tratando de dar búsqueda.")
        }

        //---- al encontrarlo lo retornamos como respuesta como hemos hecho anteriormente
        return res.status(200).json(juegoDB);
        
    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
        return next("La función getJuego ha fallado.", error)
    }

}


//! ----UPDATE
//---- para modificar un juego vamos a hacer un patch - nuestra función patch será asíncrona puesto que tardará un tiempo en recoger los datos de la base de datos y modificarlos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para modificar un juego de mi base de datos.
const patchJuego = async (req, res, next) => {

    //---- hacemos el try catch para intentar patchear el juego y si no lo consigue entrará por el catch
    try {
        
        //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
        const { id } = req.params;

        //---- Ahora recogemos con req.body (el body de la request) que tienen que pasar la validación del modelo como en los ejemplos anteriores y cuando lo tengamos lo guardamos en la constante patchJuegoDB ya que va a ser el nuevo juego modificado que querremos que se guarde 
        const patchJuegoDB = new Juego(req.body);

        //---- obligamos a que el _id de nuestro usuario modificado sea el del usuario que queremos modificar para que no haya ningún problema
        patchJuegoDB._id = id;

        //---- Utilizamos el método findByIdAndUpdate de nuestro modelo Juego para indicarle el id del juego que tenemos que actualizar y nuestra actualización
        const JuegoDB = await Juego.findByIdAndUpdate(id, patchJuegoDB);

        //---- Si mi juego anterior (JuegoDB) tenía carátula la buscamos en cloudinary y la eliminamos
        if (JuegoDB.caratula) {
            deleteFile(JuegoDB.caratula);            
        }

        //---- Si le estoy metiendo una nueva foto como fichero, la añadimos al juego modificado
        if (req.file) {
            patchJuegoDB.caratula = req.file.path;
        }

        //---- Si no está JuegoDB significa que no lo hemos encontrado en la base de datos según su id
        if (!JuegoDB) {
            return next("Juego no encontrado")
        }

        //---- mi función retorna una respuesta con status(200) y muestro el new: con mi juego modificado y el old: con el juego anterior
        return res.status(200).json({ new: patchJuegoDB, old: JuegoDB });

    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del patch y nos devuelve un error.
        return next("Error al modificar un juego", error)
    }

};


//! ----DELETE
//---- para eliminar un juego vamos a hacer un delete - nuestra función delete será asíncrona puesto que tardará un tiempo en recoger los datos de la base de datos y eliminarlos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para eliminar un juego de mi base de datos.
const deleteJuego = async (req, res, next) => {

    //---- hacemos el try catch para intentar deletear el juego y si no lo consigue entrará por el catch
    try {
        
        //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
        const { id } = req.params;

        //---- Utilizamos el método findByIdAndDelete de nuestro modelo Juego para indicarle el id del juego que tenemos que eliminar
        const juegoDB = await Juego.findByIdAndDelete(id);

        //---- Si no está JuegoDB significa que no lo hemos encontrado en la base de datos según su id
        if (!juegoDB) {
            return next("Juego no encontrado")
        }

        //---- Si mi juego anterior (JuegoDB) tenía carátula la buscamos en cloudinary y la eliminamos
        if (juegoDB.caratula) {
            deleteFile(juegoDB.caratula);
        }

        //---- mi función retorna una respuesta con status(200) y muestro el juego que acabo de eliminar
        return res.status(200).json(juegoDB);

    } catch (error) {
        //---- Cuando pasa por el catch significa que algo ha fallado en el intento del delete y nos devuelve un error.
        return next("El juego no se puede eliminar", error)
    }

}


//* EXPORTAMOS
//---- Para finalizar nuestro controlador exportamos todas nuestras funciones
module.exports = {
    postJuego,
    getJuegos,
    getJuegoById,
    getJuegoByTitulo,
    patchJuego,
    deleteJuego
  };
