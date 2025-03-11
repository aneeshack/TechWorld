export interface IChat {
    _id?: string;
    isGroupChat?: boolean;
    users?: string[];
    latestMessage?: string;
    groupName?: string;
    groupAdmin?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IMessage {
    id?: string;
    sender?: string| { _id: string; userName?: string};
    reciever?: string;
    content?: string;
    chatId?: string;
    contentType?: 'text' | 'image' | 'audio' | 'video' | 'file';
    recieverSeen?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}
