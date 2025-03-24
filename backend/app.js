import React, {useState, useEffect} from "react";
import errorHandler from "./middleware/errorHandler";

const express = require("express");
const app = express();
const cards = require("./routes/cards");
const users = require("./routes/users");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const validator = require("validator");
const {login, createUser} = require("./controllers/users");
const auth = require("./middleware/auth");
const cors = require("cors");


app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {})
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

const { PORT = 3000 } = process.env;

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/cards", cards);
app.use("/users", users);

app.use((req, res, next) => {
  const error = new Error("Recurso solicitado no encontrado");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} escuchando`);
});

