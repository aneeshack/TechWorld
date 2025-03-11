import { model,Schema, Types } from "mongoose";
import { IMessage} from "../interfaces/database/IMessage";

const messageSchema = new Schema({
    sender: {
        type: Types.ObjectId,
        ref: "users",
        required: true
    },
    reciever: {
        type: Types.ObjectId,
        ref: "users",
        required: false
    },
    content: {
        type: String, 
        required: true
    },
    chatId: {
        type: Types.ObjectId,    
        ref: "chats",
        required: true
    },
    contentType: {
        type: String,
        enum: ['text', 'image', 'audio', 'video', 'file'],
        default: 'text'
    },
    recieverSeen: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const messageModel = model<IMessage>("messages",messageSchema)