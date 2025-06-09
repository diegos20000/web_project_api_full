const mongoose = require("mongoose");
const validator = require("validator");


const avatarValidator = (value) => {
  const urlRegex =
    /\b(https?):\/\/(www\.)?[A-Za-z0-9.\-_~:/?%#[\]@!$&'()*+,;=]+\b/;
  return urlRegex.test(value);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} no es un correo electrónico válido!`,
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 80,
    select: false,
  },

  avatar: {
    type: String,
    default: 'http://localhost:5001/images/avatarpic.jpeg',
    validate: {
      validator: avatarValidator,
      message: (props) => `${props.value} no es un enlace válido para el avatar!`,
    },
  },
});


const User = mongoose.model("User", userSchema);
module.exports = { User, avatarValidator };


