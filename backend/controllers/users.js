const  User = require("../models/user");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const express = require('express');   
const router = express.Router();

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
  console.log(email, password);
  if (!email || !password) {     
    return res.status(400).send({ message: "Email y contraseña son requeridos." }); 
  }

  try {
    const existingUser = await User.findOne({ email });  
    console.log(existingUser); 
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
    console.log(newUser);    
    await newUser.save();

    if (!JWT_SECRET) { 
      console.log(process.env.JWT_SECRET);
      throw new Error("Clave secreta JWT no definida");   
    }

    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
       expiresIn: "7d",   
   });

    res.status(201).send({
     message: "Usuario creado exitosamente", user: {
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

  try {
    const user = await User.findOne({email}).select("+password");
    if (!user) {
      return res.status(401).send({message: "Correo electrónico o contraseña incorrectos"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({message: "Correo electrónico o contraseña incorrectos" });
    }

    if (!JWT_SECRET) {  
      throw new Error("Clave secreta JWT no definida");   
   }

    const token = jwt.sign({ _id: user._id}, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).send({ token }); 
   } catch (error) {   
    next(error);
     }};


  const getCurrentUser = (req, res) => {
    res.status(200).send(req.user);
  };   


module.exports = { getUsers, getUserById, createUser, login, getCurrentUser };
