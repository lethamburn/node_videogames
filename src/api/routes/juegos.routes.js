//---- Ahora, traemos nuestras rutas para gestionarlo con express
const JuegosRoutes = require('express').Router();

//---- Nos traemos todas las funciones que acabamos de crear en nuestro controlador
const { postJuego, getJuegos, getJuegoById, getJuegoByTitulo, patchJuego, deleteJuego } = require('../controllers/juegos.controller');

//---- Nos traemos las funciones de autenticación de nuestro middlewares auth
const { isAdmin, isRegistered }= require("../../middlewares/auth");

//----- Nos traemos la configuración de cloudinary para subir archivos a la que hemos llamado file
const upload = require('../../middlewares/file');

//! RUTAS
//---- Aquí tenemos nuestras rutas, con sus métodos, autenticaciones, su subida a cloudinar y el controlador que acciona esta ruta
JuegosRoutes.post('/', [isAdmin], upload.single("caratula"), postJuego);
JuegosRoutes.get('/', getJuegos);
JuegosRoutes.get('/:id', [isRegistered], getJuegoById);
JuegosRoutes.get('/titulo/:titulo', [isRegistered], getJuegoByTitulo);
JuegosRoutes.patch('/:id', [isAdmin], upload.single("caratula"), patchJuego);
JuegosRoutes.delete('/:id', [isAdmin], deleteJuego);


//* EXPORTAMOS
//---- Exportamos nuestras rutas
module.exports = JuegosRoutes