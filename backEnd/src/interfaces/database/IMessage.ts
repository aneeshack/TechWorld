import { Document } from "mongoose";

export interface IMessage extends Document{
    id?: string;
    sender?: string;
    reciever?: string;
    content?: string;
    chatId?: string;
    contentType?: 'text' | 'image' | 'audio' | 'video' | 'file';
    recieverSeen?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}
