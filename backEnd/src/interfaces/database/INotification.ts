import { Types } from "mongoose";

export interface INotification {
  _id: Types.ObjectId;
  recipient?: Types.ObjectId;
  sender?: Types.ObjectId;
  message?: Types.ObjectId;
  chat?: Types.ObjectId;
  isSeen?: boolean;
}
