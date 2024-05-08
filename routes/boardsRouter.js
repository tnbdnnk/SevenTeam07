import express from "express";

import {
    addBoard,
    getBoardById,
    getBoards,
    deleteBoard,
    updateBoard,
  } from "../controllers/boardsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidid.js";
import authenticate  from "../middlewares/authenticate.js";
import { addBoardSchema, updateBoardSchema } from "../schemas/boardSchemas.js";

const boardsRouter = express.Router();

boardsRouter
  .post("/", authenticate, validateBody(addBoardSchema), addBoard)
  .get("/", authenticate, getBoards)
  .get("/:id", authenticate, isValidId, getBoardById)
  .patch(
    "/:id",
    authenticate,
    isValidId,
    validateBody(updateBoardSchema),
    updateBoard
  )
  .delete("/:id", authenticate, isValidId, deleteBoard);

export default boardsRouter;
