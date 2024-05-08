import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title for column is required"],
    },
    columnOwner: {
      type: Schema.Types.ObjectId,
      ref: "board",
    },
  },
  { versionKey: false }
);

columnSchema.post('save', handleSaveError);

columnSchema.pre('findOneAndUpdate', setUpdateSetting);

columnSchema.post('findOneAndUpdate', handleSaveError);

const Column = ('column', columnSchema);

export default Column;