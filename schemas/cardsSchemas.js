const Joi = require("joi");

export const createCardSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().required(),
  deadline: Joi.date().required(),
});

export const updateCardSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.string(),
  deadline: Joi.date(),
});