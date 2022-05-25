//---- Ahora, traemos nuestras rutas para gestionarlo con express
const UserRoutes = require("express").Router();

//---- Nos traemos la función upload de los middlewares
const upload = require("../../middlewares/file");

//---- Nos traemos las funciones de autenticación de nuestro middlewares auth
const { isRegistered } = require("../../middlewares/auth");

//---- Nos traemos todas las funciones que acabamos de crear en nuestro controlador
const {
  postNewUser,
  loginUser,
  logOut,
  getUser,
} = require("../controllers/usuarios.controller");

//! RUTAS
//---- Aquí tenemos nuestras rutas, con sus métodos, autenticaciones, su subida a cloudinar y el controlador que acciona esta ruta
UserRoutes.post("/", upload.single("imagenPerfil"), postNewUser);
UserRoutes.post("/login", loginUser);
UserRoutes.post("/logout", [isRegistered], logOut);
UserRoutes.get("/:id", [isRegistered], getUser);

// *EXPORTAMOS
//---- Exportamos nuestras rutas
module.exports = UserRoutes;
