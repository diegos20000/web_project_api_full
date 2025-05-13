const  User = require("../models/user");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const express = require('express');   
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {   
      const error = new Error("Usuario no encontrado");   
      error.statusCode = 404;      
      throw error;  
    }
    res.send({user});
  } catch (error) {
    next (error);
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  console.log("Datos recibidos para registro:", { email, password });

  if (!email || !password) {     
    return res.status(400).send({ message: "Email y contraseña son requeridos." }); 
  }

  try {
    const existingUser = await User.findOne({ email });  
     
    if (existingUser) {    
      return res.status(409).send({ message: "El correo electrónico ya está en uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      name: name || undefined,
      about: about || undefined, 
      avatar: avatar || undefined,
      email,
      password: hashedPassword,
    });
       
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).send({
     message: "Usuario creado exitosamente",
     user: {
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      email: newUser.email,
      avatar: newUser.avatar,
     },
     token, 

    });
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(400).send({ message: "Email ya en uso" });  
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const {email, password} = req.body;
  console.log("Intentando iniciar sesión con:", email);
  try {
    const user = await User.findOne({email}).select("+password");
    console.log("Usuario encontrado:", user);
    if (!user) {
      return res.status(401).send({message: "Correo electrónico o contraseña incorrectos"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Contraseña ingresada:", password);
    console.log("Hash de la contraseña almacenado:", user.password);
    console.log("¿Coincide la contraseña?", isMatch); 
    if (!isMatch) {
      return res.status(401).send({message: "Correo electrónico o contraseña incorrectos" });
    }

    const token = generateToken(user);

    res.status(200).send({ token }); 
   } catch (error) { 
    console.error("Error en el inicio de sesión:", error);  
    next(error);
     }};


  const getCurrentUser = (req, res) => {
    res.status(200).send(req.user);
  };   


module.exports = { getUsers, getUserById, createUser, login, getCurrentUser };
