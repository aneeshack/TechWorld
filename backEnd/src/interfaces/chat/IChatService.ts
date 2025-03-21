import { IChat } from "../database/IChat";
import { IMessage } from "../database/IMessage";

export interface IChatService{
getUserMessages(userId: string): Promise<IMessage[] |null>
accessChat(userId: string, receiverId: string): Promise<IChat>

}