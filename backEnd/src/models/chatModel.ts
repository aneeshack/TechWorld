import { Schema, model } from "mongoose";

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "users", // References the UserModel
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
  },
  { timestamps: true }
);

export const ChatModel = model("chats", ChatSchema);
