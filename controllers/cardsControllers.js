import Card from "../models/CardModel.js";
import Column from "../models/ColumnModel.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const addCard = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const column = await Column.findById(id);
  if (!column) {
    throw HttpError(404, "Column  not found");
  }
  const result = await Card.create({
    ...req.body,
    cardOwner: id,
  });
  const deadline = result.deadline.toLocaleString();
  const data = { ...result._doc, deadline };
  res.status(201).json(data);
});


const deleteCard = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Card.findByIdAndDelete({ _id: id });
  if (!result) {
    throw HttpError(404, `Card id ${id} not found`);
  }
  res.json({
    id,
    message: `Card ${id} deleted successfully`,
  });
});


const updateCard = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, label, deadline } = req.body;
  const card = await Card.findById(id);
  if (!card) {
    throw HttpError(404, "Card not found");
  }
  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (description !== undefined) updatedFields.description = description;
  if (label) updatedFields.label = label;
  if (deadline) updatedFields.deadline = deadline;
  if (!title && description === undefined && !label && !deadline) {
    throw HttpError(400, "At least one field must be updated");
  }
  const updatedCard = await Card.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });
  const date = updatedCard.deadline.toLocaleString();
  res.status(200).json({ ...updatedCard._doc, deadline: date });
});


const moveCard = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { newColumnId } = req.body;
  if (typeof newColumnId !== "string" || newColumnId.length !== 24) {
    throw HttpError(400, "Invalid new column id");
  }
  const card = await Card.findById(id);
  if (!card) {
    throw HttpError(404, `Card ${id} not found`);
  }
  if (newColumnId === card.cardOwner.toString()) {
    throw HttpError(
      400,
      "New column id must be different from the current"
    );
  }
  const [column, newColumn] = await Promise.all([
    Column.findById(card.cardOwner),
    Column.findById(newColumnId),
  ]);
  if (!newColumn || !newColumn.columnOwner.equals(column.columnOwner)) {
    throw HttpError(
      400,
      `Column "${newColumnId}" is not available for moving the card to`
    );
  }
  card.cardOwner = newColumnId;
  const result = await card.save();
  const deadline = result.deadline.toLocaleString();
  const data = { ...result._doc, deadline };
  res.json({
    message: `Card "${id}" successfully moved to column "${newColumnId}"`,
    data,
  });
});

export {
    addCard,
    deleteCard,
    updateCard,
    moveCard,
};