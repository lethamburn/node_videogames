//----Importamos Express para poder crear un servidor
const express = require("express");
//----Importamos CORS para gestionar las proxies y urls permitidas
const cors = require("cors");
//----Importamos morgan para crear un log con las peticiones realizadas en nuestra consola
const morgan = require("morgan");
//----Importamos dotenv para poder acceder a las claves de cloudinary en el .env y lo configuramos
const dotenv = require("dotenv");
dotenv.config();
//----Importamos cloudinary para poder configurarlo a nivel global en el servidor
const cloudinary = require("cloudinary");
//----Y lo configuramos:
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//----Importamos la función connect para conectarnos con la base de datos
const { connect } = require("./src/utils/database");
//----Ejecutamos la función:
connect();

//----Creamos nuestro servidor express
const server = express();

//----Utilizamos morgan para tener un log de cada una de las peticiones realizadas en nuestro server cuando estamos ejecutando el script dev:
server.use(morgan("dev"));

//----Almacenamos el valor de nuestra variable de entorno PORT, si no accede tendrá el 8000 por defecto:
const PORT = process.env.PORT || 8000;

//----Con esta función Express transformará los datos a JSON para poder tratarlos
server.use(express.json());
//----Con esta función Express no codifica caracteres reservados en la URI.
server.use(express.urlencoded({ extended: false }));

//----Configuración de proxies + CORS, con el asterisco estamos permitiendo el acceso global por completo:
server.use(
  cors({
    origin: "*",
  })
);

//* ENDPOINTS:
//----Importamos las rutas de juegos, plataformas y usuarios
const  JuegosRoutes  = require("./src/api/routes/juegos.routes");
const PlataformasRoutes = require("./src/api/routes/plataformas.routes");
const UserRoutes = require("./src/api/routes/usuarios.routes");
//----Y las usamos en el servidor:
server.use("/juegos", JuegosRoutes);
server.use("/plataformas", PlataformasRoutes);
server.use("/usuarios", UserRoutes);

//----Capturamos el error si la ruta no existe
server.use("*", (req, res, next) => {
  return next("Ruta no encontrada");
});

//----Escuchamos nuestro servidor en el puerto deseado
server.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
