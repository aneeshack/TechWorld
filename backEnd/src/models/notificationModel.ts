import { model, Schema, Types } from "mongoose";
import { INotification } from "../interfaces/database/INotification";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: Types.ObjectId,
      ref: "messages",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "chats",
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const notificationModel = model<INotification>("notifications", notificationSchema);
