require("dotenv").config();
const express = require("express");
const cards = require("./routes/cards");
const users = require("./routes/users");
const mongoose = require("mongoose");
const cors = require("cors");
const {login, createUser} = require("./controllers/users");
const { requestLogger, errorLogger } = require('./middleware/Logger');
const auth = require("./middleware/auth");
const { errors } = require('celebrate');
const errorHandler = require('./middleware/errorHandler');
const path = require("path");

// Crear aplicación Express
const app = express();
app.use(express.json());



//Configuración de CORS
const allowedCors = [ 
  'https://tripleten.tk',
  'http://tripleten.tk',
  'http://localhost:3000',
  'https://www.xyzzz.chickenkiller.com',
  'https://www.xyzzz.chickenkiller.com/',
  'https://www.api.xyzzz.chickenkiller.com',
  'https://xyzzz.chickenkiller.com']; 

 app.use(cors({
  origin: (origin, callback) => {
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
 })); 



// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {})
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Logging middleware
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

// Rutas públicas
app.post("/signin", login);
app.post("/signup", createUser);

// Rutas protegidas
app.use(auth);
app.use("/users", users);
app.use("/cards", cards);

// Error logging middleware
app.use(errorLogger);

// Celebrate error handling
app.use(errors());

// Manejo de rutas no encontradas
app.all("*", (req, res, next) => {
  const error = new Error("Recurso solicitado no encontrado");
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);


// Configuración de puerto y escucha
const { PORT = 5000 } = process.env;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`); 
 });
}



module.exports = app;

