import { Types } from "mongoose";
import { IChat } from "../database/IChat";
import { IMessage } from "../database/IMessage";
import { INotification } from "../database/INotification";

export interface IChatRepository{
getUserMessages(userId: string): Promise<IMessage[] | null>
findChatByUsers(userId: string, receiverId: string): Promise<IChat>
createChat(userId: string, receiverId: string): Promise<IChat>
createMessage(messageData: Partial<IMessage>): Promise<IMessage | null>
updateChatLatestMessage(chatId: string, messageId: string): Promise<IChat | null>
findNotification(sender: string, recipient: string): Promise<INotification | null>
createNotification(recipient: string, sender: string, message: string, chat: string, isSeen: boolean): Promise<INotification | null>
updateNotification(notificationId: string, updateData: Partial<INotification>): Promise<INotification | null>
 getPopulatedMessage(messageId: Types.ObjectId): Promise<IMessage | null>;
}

