import { Document } from "mongoose";

export interface IChat extends Document{
    id?: string ;
    isGroupChat?: boolean;
    users?: string[];
    latestMessage?: string;
    groupName?: string;
    groupAdmin?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

