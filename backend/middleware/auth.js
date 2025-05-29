const jwt = require("jsonwebtoken");
const {User} = require("../models/user");


const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        console.log("Encabezado de autorización recibido:", authHeader);
        
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No se proporcionó el token.");
        return res.status(401).send({ message: "Acceso denegado. Token no proporcionado." });
   } 
    const token = authHeader.replace("Bearer ", "").trim();
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    

    if (!user) { 
        console.log("Usuario no encontrado.");
        return res.status(404).send({ message: "Usuario no encontrado." });      
    }

    req.user = user;
    next();

    } catch (error) {
        console.error("Error de autenticación:", error.message);
        res.status(401).send({ message: "Token inválido o expirado." });
    }  
};

module.exports = auth;