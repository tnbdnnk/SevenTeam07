import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().required(),
  iconURL: Joi.string(),
  backgroundURL: Joi.string(),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string(),
  iconURL: Joi.string(),
  backgroundURL: Joi.string(),
});