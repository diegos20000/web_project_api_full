const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) { 
        console.log("Encabezado de autorización no proporcionado o incorrecto");
         return res.status(401).send({ message: "Acceso denegado. Token no proporcionado."

         }); 
    }  
        const token = authHeader.replace("Bearer ", "").trim();

    try {
        console.log("Verificando token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded);
        const user = await User.findById(decoded._id);
        if (!user) { 
            return res.status(404).send({ message: "Usuario no encontrado." });      
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error de autenticación:", error);
        return res.status(401).send({message: "Token inválido."});
    }
};

module.exports = auth;