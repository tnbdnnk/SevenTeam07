import Joi from 'joi';

import { emailRegepxp, themesList } from '../constants/user-constants.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
  email: Joi.string()
    .pattern(emailRegepxp)
    .messages({
      'string.pattern.base': 'Email must be a valid email address',
    })
    .required(),
  password: Joi.string().min(8).max(64).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegepxp)
    .messages({
      'string.pattern.base': 'Email must be a valid email address',
    })
    .required(),
  password: Joi.string().min(8).max(64).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegepxp).required(),
});

export const needHelpEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegepxp).required(),
  text: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(32).optional(),
  email: Joi.string()
    .pattern(emailRegepxp)
    .messages({
      'string.pattern.base': 'Email must be a valid email address',
    })
    .optional(),
  password: Joi.string().min(8).max(64).optional(),
  avatar: Joi.binary(),
});

export const userThemeUpdateSchema = Joi.object({
  theme: Joi.string()
    .valid(...themesList)
    .required(),
});
