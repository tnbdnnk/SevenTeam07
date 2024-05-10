import express from "express";

import {
  addCard,
  updateCard,
  deleteCard,
  moveCard,
} from "../controllers/cardsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidid.js";
import authenticate from "../middlewares/authenticate.js";
import { addCardSchema, updateCardSchema } from "../schemas/cardSchemas.js";

const cardsRouter = express.Router();

cardsRouter
  .post("/:id", authenticate, validateBody(addCardSchema), addCard)
  .patch("/:id", authenticate, validateBody(updateCardSchema), updateCard)
  .delete("/:id", authenticate, isValidId, deleteCard)
  .patch("/move/:id", authenticate, isValidId, moveCard);

export default cardsRouter;
