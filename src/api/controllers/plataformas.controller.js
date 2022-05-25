//---- Traemos al controlador nuestro modelo de juego
const Plataforma = require("../models/plataformas.model");

//---- traemos nuestra función deleteFile de nuestro middlewares para eliminar los ficheros en cloudinary
const { deleteFile } = require("../../middlewares/deleteFile");

//---- Aquí crearemos nuestro CRUD... create, read, update y delete

//! ----CREATE
//---- para crear una plataforma vamos a hacer un post - nuestra función de post será asíncrona puesto que tardará un tiempo en postear una nueva plataforma a nuestra base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);
const postPlataforma = async (req, res, next) => {
  //---- Creamos un tryCatch para intentar postear la nueva plataforma y si no funciona nos devolverá el catch
  try {
    //---- Creamos una constante newPlataforma, le decimos que será una nueva Plataforma, con lo cual comprobará si coincide con los campos del modelo de la plataforma, si no coincide nos dará error. Y cuando coincida recogerá el req.body. o lo que es lo mismo el cuerpo de nuestra reques o petición.
    const newPlataforma = new Plataforma(req.body);

    //---- Aquí comprobamos si nos viene un fichero (file) en la request(req) o petición.
    if (req.file) {
      //---- en el caso de que venga su ruta se añadirá a el campo el logo de nuestra nueva plataforma
      newPlataforma.logo = req.file.path;
    }

    //---- En este punto guardaremos nuestro nueva plataforma en la base de datos.
    const plataformaDB = await newPlataforma.save();

    //---- Cuando se haya guardado la función nos devolverá (return) una respuesta (res) con el status(201) y nuestra plataforma de la base de datos creado y parseado a json para que podamos verlo correctamente.
    return res.status(201).json(plataformaDB);
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del post y nos devuelve un error.
    return next("No se ha podido crear una plataforma", error);
  }
};

//! ----READ
//---- para leer una plataforma vamos a hacer un get, o varios - nuestras funciones get serán asíncronas puesto que tardará un tiempo en recoger los datos de la base de datos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para recoger todas las plataformas de mi base de datos, en este caso no vamos a utilizar la request, aunque al crear la función la pongo porque si no se nos guardaría la request en response y nos podría llegar a crear confusión.
const getPlataformas = async (req, res, next) => {
  //---- hacemos el try catch para intentar recoger las plataformas y si no lo consigue entrará por el catch
  try {
    //---- Haremos un .find() en el modelo de Plataforma que nos recogerá todas las plataformas y los guardaremos en allPlataformasDB
    const allPlataformasDB = await Plataforma.find().populate("juegos");

    //---- nuestra función nos devuelve (return) la respuesta (res) de nuestra función por lo tanto será un status(200) con nuestras plataformas parseados a json
    return res.status(200).json(allPlataformasDB);
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
    return next(
      "No se han podido solicitar las plataformas a la base de datos",
      error
    );
  }
};

//---- Crearemos una función para recoger una sola plataforma según su id de mi base de datos.
const getPlataformaById = async (req, res, next) => {
  //---- hacemos el try catch para intentar recoger la plataforma y si no lo consigue entrará por el catch
  try {
    //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
    const { id } = req.params;

    //---- Ahora realizaremos una búsqueda por id, el id lo tenemos guardado en nuestra variable id, y utilizamos la función findById de nuestro modelo de la base de datos.
    const plataformaDB = await Plataforma.findById(id);

    //---- Comprobamos si lo ha encontrado o no, si no lo encuentra no entra dentro del if (que nos devolverá un error de que no ha encontrado el juego en la base de datos) y si lo encuentra sigue.
    if (!plataformaDB) {
      return next(
        "No se encuentra la plataforma a la que usted está tratando de dar búsqueda."
      );
    }

    //---- al encontrarlo lo retornamos como respuesta como hemos hecho anteriormente
    return res.status(200).json(plataformaDB);
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
    return next("La función getPlataforma ha fallado.");
  }
};

//---- Crearemos una función para recoger una sola plataforma según su título de mi base de datos.

const getPlataformaByTitulo = async (req, res, next) => {
  //---- hacemos el try catch para intentar recoger la plataforma y si no lo consigue entrará por el catch
  try {
    //---- recogeremos el titulo por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro titulo.
    const { name } = req.params;

    //---- Ahora realizaremos una búsqueda por name, el name lo tenemos guardado en nuestra variable name, y utilizamos la función find de nuestro modelo de la base de datos.
    //---- a diferencia del id que utilizábamos una función findById, como nuestra función find, no sabe sobre que tiene que buscar se lo tendremos que indicar, busca por name con los datos que tengo guardados en mi variable name.
    const plataformaDB = await Plataforma.find({ name: name });

    //---- Comprobamos si lo ha encontrado o no, si no lo encuentra no entra dentro del if (que nos devolverá un error de que no ha encontrado la plataforma en la base de datos) y si lo encuentra sigue.
    if (!plataformaDB) {
      return next(
        "No se encuentra la unidad de plataforma a la que usted está tratando de dar búsqueda."
      );
    }

    //---- al encontrarlo lo retornamos como respuesta como hemos hecho anteriormente
    return res.status(200).json(plataformaDB);
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del get y nos devuelve un error.
    return next("La función getPlataformaByTitulo ha fallado.");
  }
};

//! ----UPDATE
//---- para modificar una plataforma vamos a hacer un patch - nuestra función patch será asíncrona puesto que tardará un tiempo en recoger los datos de la base de datos y modificarlos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para modificar una plataforma de mi base de datos.
const patchPlataforma = async (req, res, next) => {
  //---- hacemos el try catch para intentar patchear la plataforma y si no lo consigue entrará por el catch
  try {
    //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
    const { id } = req.params;
    //---- Ahora recogemos con req.body (el body de la request) que tienen que pasar la validación del modelo como en los ejemplos anteriores y cuando lo tengamos lo guardamos en la constante patchPlataformaDB ya que va a ser la nueva plataforma modificado que querremos que se guarde
    const patchPlataformaDB = new Plataforma(req.body);
    //---- obligamos a que el _id de nuestro usuario modificado sea el del usuario que queremos modificar para que no haya ningún problema
    patchPlataformaDB._id = id;
    //---- Utilizamos el método findByIdAndUpdate de nuestro modelo Plataforma para indicarle el id del plataforma que tenemos que actualizar y nuestra actualización

    const foundPlataforma = await Plataforma.findById(id);

    patchPlataformaDB.juegos = [
      ...patchPlataformaDB.juegos,
      ...foundPlataforma.juegos,
    ];

    //TODO: HACER QUE AL EJECUTAR EL PATCH NO ELIMINE LOS JUEGOS QUE HABIA
    const PlataformaDB = await Plataforma.findByIdAndUpdate(
      id,
      patchPlataformaDB
    );
    //---- Si mi plataforma anterior (PlataformaDB) tenía logo lo buscamos en cloudinary y lo eliminamos
    if (req.file) {
      deleteFile(PlataformaDB.logo);
    }
    //---- Si le estoy metiendo una nueva foto como fichero, la añadimos a la plataforma modificada
    if (req.file) {
      patchPlataformaDB.logo = req.file.path;
    }
    //---- Si no está PlataformaDB significa que no lo hemos encontrado en la base de datos según su id
    if (!PlataformaDB) {
      return next("Plataforma no encontrada");
    }
    //---- mi función retorna una respuesta con status(200) y muestro el new: con mi plataforma modificada y el old: con la plataforma anterior
    return res.status(200).json({ new: patchPlataformaDB, old: PlataformaDB });
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del patch y nos devuelve un error.
    return next("Error al modificar una plataforma", error);
  }
};

//! ----DELETE
//---- para eliminar unaa plataforma vamos a hacer un delete - nuestra función delete será asíncrona puesto que tardará un tiempo en recoger los datos de la base de datos y eliminarlos, recogemos como siempre (req, res, next) para la request(peticion), response(respuesta) y next(para seguir);

//---- Crearemos una función para eliminar una plataforma de mi base de datos.
const deletePlataforma = async (req, res, next) => {
  //---- hacemos el try catch para intentar deletear la plataforma y si no lo consigue entrará por el catch
  try {
    //---- recogeremos el id por los parámetros de la request(req), esto se refiere a cuando al endpoint lleva unos parámetros, los recogemos y los utilizamos, en este caso recogemos el parámetro id.
    const { id } = req.params;
    //---- Utilizamos el método findByIdAndDelete de nuestro modelo Plataforma para indicarle el id del plataforma que tenemos que eliminar
    const plataformaDB = await Plataforma.findByIdAndDelete(id);
    //---- Si no está PlataformaDB significa que no lo hemos encontrado en la base de datos según su id
    if (!plataformaDB) {
      return next("Plataforma no encontrada");
    }
    //---- Si mi plataforma anterior (JuegoDB) tenía carátula la buscamos en cloudinary y la eliminamos
    if (plataformaDB.logo) {
      deleteFile(plataformaDB.logo);
    }
    //---- mi función retorna una respuesta con status(200) y muestro la plataforma que acabo de eliminar
    return res.status(200).json(plataformaDB);
  } catch (error) {
    //---- Cuando pasa por el catch significa que algo ha fallado en el intento del delete y nos devuelve un error.
    return next("La plataforma no se puede eliminar", error);
  }
};

//* EXPORTAMOS
//---- Para finalizar nuestro controlador exportamos todas nuestras funciones
module.exports = {
  postPlataforma,
  getPlataformas,
  getPlataformaById,
  getPlataformaByTitulo,
  patchPlataforma,
  deletePlataforma,
};
