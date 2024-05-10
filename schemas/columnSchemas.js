import Joi from "joi";

const addColumnSchema = Joi.object({
  title: Joi.string().required().messages({ "any.required": "missing required Column title" }),
  columnOwner: Joi.string(),
});

const updateColumnSchema = Joi.object({
  title: Joi.string().required().messages({ "any.required": "missing required Column title" }),
});


export { addColumnSchema, updateColumnSchema };