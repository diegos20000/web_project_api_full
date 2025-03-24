const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener usuarios", error });
  }
};

const getUserById = async (req, res) => {
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

const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    const newUser = new User({ 
      name: name || undefined,
      about: about || undefined, 
      avatar: avatar || undefined,
      email, password 
    });

    await newUser.save();
    res.status(201).send({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(400).send({ message: "Email ya en uso" });  
    }
    console.log(error);
    res.status(400).send({ message: "Error al crear el usuario", error });
  }
};

const login = async (req,res) => {
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

    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).send({ token }); 
   } catch (error) {   
     console.error(error);  
       res.status(500).send({ message: "Error al autenticar al usuario", error }); 
     }};


  const getCurrentUser = (req, res) => {
    res.status(200).send(req.user);
  };   


module.exports = { getUsers, getUserById, createUser, login, getCurrentUser };
