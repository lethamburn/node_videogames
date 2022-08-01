//---- Requerimos la librería jsonwebtoken
const jwt = require('jsonwebtoken')

//---- generamos la firma con para nuestro token con nuestro id y email y hacemos que expire en 1 día
const generateSign = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1d' })
}


//---- verificamos que nuestro token es válido y que no ha expirado
const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}


//---- exportamos ambas funciones
module.exports = { generateSign, verifyJwt }