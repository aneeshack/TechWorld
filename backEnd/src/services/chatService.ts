import { IMessage } from "../interfaces/database/IMessage";
import { ChatRepository } from "../repository/chatRepository";

export class ChatService{
    constructor(private chatRepository: ChatRepository){}

    async saveMessage(message: IMessage): Promise<IMessage> {
        return await this.chatRepository.saveMessage(message);
      }
    
      async getMessages(chatId: number): Promise<IMessage[]> {
        return await this.chatRepository.getMessages(chatId);
      }
}