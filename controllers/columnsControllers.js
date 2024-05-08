import Board from "../models/BoardModel.js";
import Column from "../models/ColumnModel.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const addColumn = ctrlWrapper(async (req, res) => {
  const { id: columnOwner } = req.params;
  const { title } = req.body;
  const isBoardExists = await Board.findOne({ _id: columnOwner });
  if (!isBoardExists) {
    throw HttpError(404, `Board not found`);
  }
  const isColumnExists = await Column.findOne({ columnOwner, title });
  if (isColumnExists) {
    throw HttpError(409, `Column "${title}" already exist`);
  }
  const result = await Column.create({ ...req.body, columnOwner });
  res.status(201).json(result);
});


const updateColumn = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const column = await Column.findById(id);
  if (!column) {
    throw HttpError(404, "Column not found");
  }
  const columnOwner = column.columnOwner;
  const isColumnExists = await Column.findOne({ columnOwner, title });
  if (isColumnExists) {
    throw HttpError(409, `Column "${title}" already exists`);
  }
  const result = await Column.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.json(result);
});


const deleteColumn = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const isColumnExists = await Column.findOne({ _id: id });
  if (!isColumnExists) {
    throw HttpError(404, `Column with id "${id}" not found`);
  }
  console.log(isColumnExists);
  await Card.deleteMany({ cardOwner: id });
  await Column.findByIdAndDelete(id);
  res.json({
    id,
    message: `Column ${id} deleted successfully`,
  });
});


export  {
    addColumn,
    updateColumn,
    deleteColumn,
};