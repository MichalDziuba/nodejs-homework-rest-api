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

module.exports = {validationSchema, updateContactSchema};
