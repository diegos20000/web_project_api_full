const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
      validator: validator.isEmail,
      message: "email invalido",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 80,
    select: false
  },

  avatar: {
    type: String,
    //required: true,
    //default: "",
    validate: {
      validator: avatarValidator,
      message: (props) =>
        `${props.value} no es un enlace válido para el avatar!`,
    },
  },
});

// userSchema.pre('save', function(next) {
//     if (this.isModified('password')) {
//      this.password = bcrypt.hashSync(this.password, 10);
//     }    
//     next();
//  });

module.exports = mongoose.model("User", userSchema);
