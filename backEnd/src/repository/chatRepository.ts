import { IChatRepository } from "../interfaces/chat/IChatRepository";
import { IMessage } from "../interfaces/database/IMessage";
import { messageModel } from "../models/messageModel";


export class ChatRepository implements IChatRepository{
    async saveMessage(message: IMessage): Promise<IMessage> {
        const newMessage = new messageModel(message);
        return await newMessage.save();
      }

      async getMessages(chatId: number): Promise<IMessage[]> {
        return await messageModel.find({ chatId }).sort({ timestamp: 1 });
      }
}