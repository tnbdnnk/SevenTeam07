import { Card } from "../schemas/cardsSchemas";

export const addCard = async (body) => {
  return Card.create(body);
};

export const getCardById = async (cardId) => {
  return Card.findById(cardId);
};

export const removeCard = async (cardId) => {
  return Card.findByIdAndDelete(cardId);
};

export const updateCard = async (cardId, body) => {
  return Card.findByIdAndUpdate(cardId, { ...body }, { new: true });
};

export const changeColumn = async (cardId, columnId) => {
  return Card.findByIdAndUpdate(cardId, { column: columnId }, { new: true });
};