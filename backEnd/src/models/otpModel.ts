import mongoose, { Schema, Model, model, Document } from "mongoose";


interface IOtp extends Document{
    email: string,
    otp: string,
    createdAt: Date
}
const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp:{
        type:String,
        required: true
    },
    createdAt:{
        type : Date,
        default: Date.now,
        expires: '5m'  //otp expired after 5 minutes
    }
  },
);

const OtpModel: Model<IOtp> = model<IOtp>('Otp',OtpSchema)
export default OtpModel;
