import { Types } from "mongoose";
import { IChat } from "../interfaces/database/IChat";
import { IMessage } from "../interfaces/database/IMessage";
import { ChatRepository } from "../repository/chatRepository";
import { IChatRepository } from "../interfaces/chat/IChatRepository";

export class ChatService {
  constructor(private chatRepository: IChatRepository) {}

  async getUserMessages(userId: string): Promise<IMessage[] |null> {
    try {
      return await this.chatRepository.getUserMessages(userId);
    } catch (error) {
      console.log("chat service error:get user messages", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async accessChat(userId: string, receiverId: string): Promise<IChat> {
    try {
      if (!userId || !receiverId) {
        throw new Error("UserId and receiverId are required");
      }

      // Check if chat already exists
      const existingChat = await this.chatRepository.findChatByUsers(
        userId,
        receiverId
      );
      if (existingChat) return existingChat;

      // Create new chat if not found
      return await this.chatRepository.createChat(userId, receiverId);
    } catch (error) {
      console.log("chat service error:access chat", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async saveMessage(
    sender: string,
    reciever: string,
    content: string,
    contentType: string='text'
  ): Promise<IChat> {
    try {
      console.log('inside save message')
      let chat = await this.chatRepository.findChatByUsers(sender, reciever);
      if (!chat) {
        chat = await this.chatRepository.createChat(sender, reciever);
      }

      if(!chat?._id){
        throw new Error('no chat id')
      }
      const newMessage = await this.chatRepository.createMessage({
        sender,
        reciever,
        content,
        contentType:'text',
        chatId: chat._id as string,
      });

      if(!newMessage?._id){
        throw new Error('no message id')
      }

      await this.chatRepository.updateChatLatestMessage(
        chat._id as string,
        newMessage._id as string
      );


      const existingNotification = await this.chatRepository.findNotification(sender, reciever);

if (!existingNotification) {
  await this.chatRepository.createNotification(
     reciever,
    sender,
    newMessage._id.toString(),
    chat._id.toString(),
     false );
} else {

  await this.chatRepository.updateNotification(existingNotification._id.toString(), { isSeen: false, message:new Types.ObjectId(newMessage._id.toString())});
}



      const populatedMessage = await this.chatRepository.getPopulatedMessage(
        new Types.ObjectId(newMessage._id.toString())
      );


      if (!populatedMessage) {
        throw new Error("Message not found");
      }
      console.log('populated message',populatedMessage)
      return populatedMessage;

    } catch (error) {
      console.log("chat service error: send message", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

}
