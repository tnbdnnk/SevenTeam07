import Board from "../models/BoardModel.js";
import Card from "../models/CardModel.js";
import Column from "../models/ColumnModel.js";
import User from "../models/User.js"
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import mongoose from "mongoose";

const addBoard = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { title } = req.body;

  const isBoardExists = await Board.findOne({ owner, title });
  if (isBoardExists) {
    throw HttpError(409, `Board "${title}" already exists`);
  }

  const newBoard = await Board.create({ ...req.body, owner });

  await User.findByIdAndUpdate(owner, {
    activeBoard: newBoard._id,
  });
  res.status(201).json(newBoard);
});


const getBoardById = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const board = await Board.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "columns",
        localField: "_id",
        foreignField: "columnOwner",
        as: "columns",
      },
    },
    { $unwind: { path: "$columns", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "cards",
        localField: "columns._id",
        foreignField: "cardOwner",
        as: "columns.cards",
      },
    },
  ]);
  if (!board || board.length === 0) {
    throw HttpError(404, `Board with id${id} is not found`);
  }
  const formattedBoard = {
    _id: board[0]._id,
    title: board[0].title,
    icon: board[0].icon,
    background: board[0].background,
    owner: board[0].owner,
    columns: board.map((col) => ({
      _id: col.columns._id,
      title: col.columns.title,
      columnOwner: col.columns.columnOwner,
      cards: col.columns.cards.map((card) => {
        const updatedCard = {
          ...card,
          deadline: card.deadline.toLocaleString(),
        };
        return updatedCard;
      }),
    })),
  };
  await User.findByIdAndUpdate(_id, {
    activeBoard: id,
  });
  res.json(formattedBoard);
});


const getBoards = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Board.find({ owner });
  res.json(result);
});


const deleteBoard = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const columns = await Column.find({ board: id });
  for (const column of columns) {
    await Card.deleteMany({ column: column._id });
  }
  await Column.deleteMany({ board: id });
  const deletedBoard = await Board.findByIdAndDelete(id);
  if (!deletedBoard) {
    throw HttpError(404, `Board with id ${id} not found`);
  }
  await User.findByIdAndUpdate(_id, {
    activeBoard: null,
  });
  res.json({
    id,
    message: `Board with id ${id} deleted successfully`,
  });
});


const updateBoard = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { title, icon, background } = req.body;
  const board = await Board.findOne({ _id: id, owner });
  if (!board) {
    throw HttpError(404, "Not Found");
  }

  // Перевіряємо, чи є інша дошка з таким же заголовком (окрім поточної)
  const isBoardExists = await Board.findOne({ owner, title, _id: { $ne: id } });
  if (isBoardExists) {
    throw HttpError(409, `Board "${title}" already exists`);
  }

  // Оновлюємо поля дошки
  if (
    (title && title !== board.title) ||
    (icon && icon !== board.icon) ||
    (background && background !== board.background)
  ) {
    if (title) board.title = title;
    if (icon) board.icon = icon;
    if (background) board.background = background;
    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    throw HttpError(400, "No data to update");
  }
});



export  {
  addBoard,
  getBoardById,
  getBoards,
  deleteBoard,
  updateBoard,
};