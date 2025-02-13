import  { Schema, Model, model } from "mongoose";
import { IUser, Role } from "../interfaces/user/IUser";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
    },
    profile: {
      type: Object,
    },
    contact: {
      type: Object,
    },
    profession: {
      type: String,
    },
    qualification: {
      type: String,
    },
    cv: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
    },
    profit: {
      type: String,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
    requestStatus: {
      type: Object,
    },
    isRequested: {
      type: Boolean,
      default: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: Date,
    },
    loginStreak: {
      type: Number,
    },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = model<IUser>('User',UserSchema)
export default UserModel;