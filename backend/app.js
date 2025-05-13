require("dotenv").config();
const express = require("express");
const cards = require("./routes/cards");
const users = require("./routes/users");
const mongoose = require("mongoose");
const cors = require("cors");
const {login, createUser, getUsers} = require("./controllers/users");
const { requestLogger, errorLogger } = require('./middleware/Logger');
const auth = require("./middleware/auth");
const { errors } = require('celebrate');
const errorHandler = require('./middleware/errorHandler');
const jwt = require('jsonwebtoken');
const path = require("path");

// Crear aplicación Express
const app = express();

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Configuración de CORS
const allowedCors = [ 
   'https://tripleten.tk',
   'http://tripleten.tk',
   'http://localhost:3000'];

app.use((req, res, next) => {
  const {origin} = req.headers;
  const {method} = req;

  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE"; 

  if (allowedCors.includes(origin)) { 
    res.header('Access-Control-Allow-Origin', origin); 
   }

   if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    const requestHeaders = req.headers['access-control-request-headers'];
    if (requestHeaders) {
      res.header('Access-Control-Allow-Headers', requestHeaders);
    }
    return res.sendStatus(204);
   }

   next();
});

app.use(express.json());
app.use(requestLogger);

// Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {})
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Rutas protegidas
app.use("/users", users);
app.use("/cards", cards);

// Middleware de manejo de errores global
app.use(errorLogger);
app.use(errorHandler);

//crash-test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

// Rutas públicas
app.post("/signin", login);
app.post("/signup", createUser);

// Middleware de autorización
app.use(auth);




// Middleware de manejo de errores

app.use(errors());

// Manejo de rutas no encontradas
app.all("*", (req, res, next) => {
  const error = new Error("Recurso solicitado no encontrado");
  error.statusCode = 404;
  next(error);
});



// Configuración de puerto y escucha
const { PORT = 5008 } = process.env;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`); 
 });
}



module.exports = app;

