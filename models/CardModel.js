import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set name for card"],
    },
    description: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      enum: ["without", "low", "medium", "high"],
      default: "without",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      default: () => new Date().setDate(new Date().getDate() + 1),
    },
    cardOwner: {
      type: Schema.Types.ObjectId,
      ref: "column",
    },
  },
  { versionKey: false, timestamps: false }
);

cardSchema.post('save', handleSaveError);

cardSchema.pre('findOneAndUpdate', setUpdateSetting);

cardSchema.post('findOneAndUpdate', handleSaveError);

const Card = model('card', cardSchema);

export default Card;
