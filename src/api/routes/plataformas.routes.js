//---- Ahora, traemos nuestras rutas para gestionarlo con express
const PlataformasRoutes = require('express').Router();

//---- Nos traemos todas las funciones que acabamos de crear en nuestro controlador
const { postPlataforma, getPlataformas, getPlataformaById, getPlataformaByTitulo, patchPlataforma, deletePlataforma } = require('../controllers/plataformas.controller');

//---- Nos traemos las funciones de autenticación de nuestro middlewares auth
const { isAdmin, isRegistered }= require("../../middlewares/auth");

//----- Nos traemos la configuración de cloudinary para subir archivos a la que hemos llamado file
const upload = require('../../middlewares/file');

//! RUTAS
//---- Aquí tenemos nuestras rutas, con sus métodos, autenticaciones, su subida a cloudinar y el controlador que acciona esta ruta
PlataformasRoutes.post('/', [isAdmin], upload.single("logo"), postPlataforma);
PlataformasRoutes.get('/', [isRegistered], getPlataformas);
PlataformasRoutes.get('/:id', [isRegistered], getPlataformaById);
PlataformasRoutes.get('/name/:name', [isRegistered], getPlataformaByTitulo);
PlataformasRoutes.patch('/:id', [isAdmin], upload.single("logo"), patchPlataforma);
PlataformasRoutes.delete('/:id', [isAdmin], deletePlataforma);


//* EXPORTAMOS
//---- Exportamos nuestras rutas
module.exports = PlataformasRoutes