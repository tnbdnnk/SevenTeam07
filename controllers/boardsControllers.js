import * as boardsServices from "../services/boardsServices.js";
import { ctrlWrapper } from "../helpers/index.js";
import { Board } from "../schemas/boardsSchemas.js";
import { Column } from "../schemas/columnsSchemas.js";
import { Card } from ("../schemas/cardsSchemas.js");

const createBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const board = await boardsServices.addBoard({ ...req.body, owner });
  res.status(201).json(board);
};

const getAllBoards = async (req, res) => {
  const { _id: owner } = req.user;
  const boards = await boardsServices.listBoards({ owner });
  res.status(200).json(boards);
};

const getById = async (req, res) => {
  const { boardId } = req.params;
  const board = await Board.findById(boardId);
  const columns = await Column.find({ board: board._id });
  if (columns.length > 0) {
    const columnsWithOwnCards = await Column.aggregate([
      {
        $match: { $or: columns },
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "column",
          as: "cards",
        },
      },
    ]);
    if (!board) throw HttpError(404);

    res.json({
      board,
      columns: columnsWithOwnCards,
    });
  }
  res.json({
    board,
    columns: [],
  });
};

const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  const deletedBoard = await Board.findByIdAndDelete(boardId);
  const columns = await Column.find({ board: boardId });
  const deletedColumn = await Column.deleteMany({ board: boardId });
  const ArrayColumnsIds = columns.map((column) => column._id);
  const deletedCard = await Card.deleteMany({ column: ArrayColumnsIds });
  if (!deletedBoard || !deletedColumn || !deletedCard || !columns)
    throw HttpError(404);
  res.json({
    deletedBoard,
    deletedColumn,
    deletedCard,
  });
};

const updateCurrentBoard = async (req, res) => {
  const { boardId } = req.params;
  const board = await boardsServices.updateCurrentBoard(boardId, req.body);
  res.status(200).json(board);
};

export default = {
  getAllBoards: ctrlWrapper(getAllBoards),
  getById: ctrlWrapper(getById),
  deleteBoard: ctrlWrapper(deleteBoard),
  createBoard: ctrlWrapper(createBoard),
  updateCurrentBoard: ctrlWrapper(updateCurrentBoard),
};
