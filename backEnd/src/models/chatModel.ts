import { model,Schema, Types } from "mongoose";
import { IChat } from "../interfaces/database/IChat";

const chatSchema = new Schema({
   
    isGroupChat : {
        type: Boolean,
        default: false
    },
    users : [{
        type: Types.ObjectId,
        ref: "users",
        required : true
    }],
    latestMessage : {
        type: Types.ObjectId,
        ref: "messages"
    },
    groupName : {
        type: String
    },
    groupAdmin : {
        type: Types.ObjectId,
        ref: "users"
    },
},{
    timestamps : true
})

export const chatModel = model<IChat> ("chats",chatSchema)
