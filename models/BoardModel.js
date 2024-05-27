import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title for board is required!"],
    },
    icon: {
      type: String,
      default: "icon-project",
    },
    background: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

boardSchema.post('save', handleSaveError);

boardSchema.pre('findOneAndUpdate', setUpdateSetting);

boardSchema.post('findOneAndUpdate', handleSaveError);

const Board = model('board', boardSchema);

export default Board;