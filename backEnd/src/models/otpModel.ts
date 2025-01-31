import mongoose, { Schema, Model, model } from "mongoose";
import { IUser, Role } from "../interfaces/user/IUser";


interface IOtp extends IUser{
    otp:string,
    createdAt: Date
}
const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
    },
    otp:{
        type:String
    },
    createdAt:{
        type : Date,
        default: Date.now,
        expires: '10m'
    }
  },
);

const OtpModel: Model<IOtp> = model<IOtp>('Otp',OtpSchema)
export default OtpModel;