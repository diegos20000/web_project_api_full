const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) { 
         return res.status(401).send({ message: "Acceso denegado. Token no proporcionado."

         }); 
    }  
        const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!req.user) { 
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