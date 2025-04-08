const express = require("express");
const cards = require("./routes/cards");
const users = require("./routes/users");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const {login, createUser, getCurrentUser} = require("./controllers/users");
const { requestLogger, errorLogger } = require('./middleware/Logger');
const auth = require("./middleware/auth");
const { errors } = require('celebrate');

// Crear aplicación Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {})
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Middleware de logging
app.use(requestLogger);

// Rutas públicas
app.post("/signin", login);
app.post("/signup", createUser);

// Middleware de autorización
app.use(auth);

// Rutas protegidas
app.use("/cards", cards);
app.use("/users", users);

// Middleware de manejo de errores
app.use(errorLogger);
app.use(errors());

// Manejo de rutas no encontradas
app.all("*", (req, res, next) => {
  const error = new Error("Recurso solicitado no encontrado");
  error.statusCode = 404;
  next(error);
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => { 
  res.status(err.statusCode || 500).send({ message: 'Se ha producido un error en el servidor' });
});

// Configuración de puerto y escucha
const { PORT = 3000 } = process.env;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {console.log(`App escuchando en el puerto ${PORT}`); 
 });
}

module.exports = app;

