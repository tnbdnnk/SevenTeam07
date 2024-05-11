import express from "express";

import {
  addColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/columnsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidid.js";
import authenticate from "../middlewares/authenticate.js";
import { addColumnSchema, updateColumnSchema } from "../schemas/columnSchemas.js";

const columnsRouter = express.Router();

columnsRouter
  .post(
    "/:id",
    authenticate,
    isValidId,
    validateBody(addColumnSchema),
    addColumn
  )
  .patch(
    "/:id",
    authenticate,
    isValidId,
    validateBody(updateColumnSchema),
    updateColumn
  )
  .delete(
    "/:id",
    authenticate,
    isValidId,
    deleteColumn
  );

export default columnsRouter;
