const Joi = require("joi");

const validationSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().min(7).max(50).required(),
  phone: Joi.string().min(6).max(18).required(),
  favorite: Joi.boolean(),
});
const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email().min(7).max(50),
  phone: Joi.string().min(6).max(12),
});
const userSchema = Joi.object({
  password: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().min(8).max(50).required(),
});
const resendEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
module.exports = { validationSchema, updateContactSchema, userSchema, resendEmailSchema};
