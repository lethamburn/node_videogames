//---- Importamos multer de la libreria multer para gestionar ficheros
const multer = require('multer');

//---- Importamos cloudinary de la libreria cloudinary
const cloudinary = require('cloudinary').v2;

//---- Importamos CloudinaryStorage de la librería multer-storage-cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//---- Generamos nuestro storage para almacenar en cloudinary, le pasaremos un objeto con nuestro cloudinary y los parametros: folder que es la carpeta de cloudinary donde guardamos y los allowed formats que es los formatos válidos de archivos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'juegos',
        allowedFormats: ["jpg", "png", 'jpeg', 'gif']
    }
})

//---- creamos una función que genera el multer con la información del storage
const upload = multer({ storage });

//---- exportamos la función upload
module.exports = upload;