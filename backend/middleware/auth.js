const jwt = require("jsonwebtoken");
const {User} = require("../models/user");

const auth = async (req, res, next) => {
    const token = req.headers["Authorization"]?.replace("Bearer ","");

    if (!token) {
        return res.status(401).send({ message: "Acceso denegado. Token no proporcionado."})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        if (!req.user) { 
            return res.status(404).send({ message: "Usuario no encontrado." });      
        }
        next();
    } catch (error) {
        return res.status(401).send({message: "Token inválido."});
    }
};

module.exports = auth;