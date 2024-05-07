import { Board } from "../schemas/boardsSchemas";

export const addBoard = async (body) => {
  return Board.create(body);
};

export const listBoards = async (owner) => {
  return Board.find(owner);
};

export const getBoardById = async (boardId) => {
  return Board.findById(boardId);
};

export const updateCurrentBoard = async (boardId, body) => {
  return Board.findByIdAndUpdate(boardId, { ...body }, { new: true });
};