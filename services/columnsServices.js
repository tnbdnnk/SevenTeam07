import { Column } from "../schemas/columnsSchemas";

export const addColumn = async (body) => {
  return Column.create(body);
};

export const getColumnById = async (columnId) => {
  return Column.findById(columnId);
};

export const removeColumn = async (columnId) => {
  return Column.findByIdAndDelete(columnId);
};

export const updateColumn = async (columnId, body) => {
  return Column.findByIdAndUpdate(columnId, { ...body }, { new: true });
};