import Joi from "joi";

const addBoardSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": "missing required Board title" }),
  icons: Joi.string().valid(
    "#icon-project",
    "#icon-star",
    "#icon-loading",
    "#icon-puzzle",
    "#icon-container",
    "#icon-lightning",
    "#icon-colors",
    "#icon-hexagon"
  ),
  background: Joi.string()
    .valid(
      "bg0",
      "bg1",
      "bg2",
      "bg3",
      "bg4",
      "bg5",
      "bg6",
      "bg7",
      "bg8",
      "bg9",
      "bg10",
      "bg11",
      "bg12",
      "bg13",
      "bg14",
      "bg15"
    )
    .default("bg0"),
  owner: Joi.string(),
});

const updateBoardSchema = Joi.object({
  title: Joi.string(),
  icons: Joi.string().valid(),
  background: Joi.string().valid(
    "bg0",
    "bg1",
    "bg2",
    "bg3",
    "bg4",
    "bg5",
    "bg6",
    "bg7",
    "bg8",
    "bg9",
    "bg10",
    "bg11",
    "bg12",
    "bg13",
    "bg14",
    "bg15"
  ),
});

export  { addBoardSchema, updateBoardSchema };