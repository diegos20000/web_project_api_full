const {celebrate, Joi} = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.error('string.uri');
  }

  Joi.String().required().custom(validateURL);