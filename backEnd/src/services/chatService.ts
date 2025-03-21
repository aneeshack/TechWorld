import { Types } from "mongoose";
import { IChat } from "../interfaces/database/IChat";
import { IMessage } from "../interfaces/database/IMessage";
import { ChatRepository } from "../repository/chatRepository";

export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

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

  //   async sendMessage(sender: string, receiver: string, content: string, contentType: string = 'text'): Promise<IMessage> {
  //     let chat = await this.chatRepository.findChatByUsers(sender, receiver);

  //     if (!chat) {
  //       chat = await this.chatRepository.createChat([sender, receiver]);
  //     }

  //     const newMessage = await this.chatRepository.createMessage({
  //       sender,
  //       reciever: receiver,
  //       content,
  //       contentType,
  //       chatId: chat._id
  //     });

  //     await this.chatRepository.updateChatLatestMessage(chat._id, newMessage._id);
  //     await this.chatRepository.deleteNotifications(sender, receiver);

  //     await this.chatRepository.createNotification({
  //       recipient: receiver,
  //       sender,
  //       message: newMessage._id,
  //       chat: chat._id,
  //       isSeen: false
  //     });

  //     return (await this.chatRepository.getPopulatedMessage(newMessage._id))!;
  //   }
}

// import { ChatRepository } from "../repository/chatRepository";
// import { IChat } from "../interfaces/database/IChat";
// import { IMessage } from "../interfaces/database/IMessage";
// import { INotification } from "../interfaces/database/INotification";
// import { ObjectId } from "mongoose";

// export class ChatService {
//   private chatRepository: ChatRepository;

//   constructor() {
//     this.chatRepository = new ChatRepository();
//   }

//   async accessChat(userId: string, receiverId: string): Promise<IChat> {
//     let chat = await this.chatRepository.findChatByUsers(userId, receiverId);

//     if (!chat) {
//       chat = await this.chatRepository.createChat([userId, receiverId]);
//     }

//     return (await this.chatRepository.getPopulatedChat(chat._id))!;
//   }

//   async sendMessage(sender: string, receiver: string, content: string, contentType: string = 'text'): Promise<IMessage> {
//     let chat = await this.chatRepository.findChatByUsers(sender, receiver);

//     if (!chat) {
//       chat = await this.chatRepository.createChat([sender, receiver]);
//     }

//     const newMessage = await this.chatRepository.createMessage({
//       sender,
//       reciever: receiver,
//       content,
//       contentType,
//       chatId: chat._id
//     });

//     await this.chatRepository.updateChatLatestMessage(chat._id, newMessage._id);
//     await this.chatRepository.deleteNotifications(sender, receiver);

//     await this.chatRepository.createNotification({
//       recipient: receiver,
//       sender,
//       message: newMessage._id,
//       chat: chat._id,
//       isSeen: false
//     });

//     return (await this.chatRepository.getPopulatedMessage(newMessage._id))!;
//   }

//   async getMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
//     const chat = await this.chatRepository.findChatByUsers(senderId, receiverId);
//     return chat ? await this.chatRepository.getMessagesByChatId(chat._id) : [];
//   }

//   async markMessagesSeen(chatId: string, userId: string): Promise<void> {
//     await this.chatRepository.markMessagesSeen(chatId, userId);
//   }

//   async getUserChats(userId: string): Promise<any[]> {
//     const chats = await this.chatRepository.getUserChats(userId);
//     return Promise.all(
//       chats.map(async (chat) => {
//         if (chat.latestMessage) {
//           const message = await this.chatRepository.getPopulatedMessage(chat.latestMessage._id);
//           return { ...chat.toObject(), latestMessage: message };
//         }
//         return chat;
//       })
//     );
//   }

//   async getMessagedStudents(instructorId: string): Promise<any[]> {
//     const messages = await this.chatRepository.getMessagedStudents(instructorId);
//     return Array.from(
//       new Map(messages.map(msg => [msg?.sender?.toString(), msg.sender])).values()
//     );
//   }

//   async getNotifications(userId: string): Promise<INotification[]> {
//     return this.chatRepository.getNotifications(userId);
//   }

//   async markNotificationsAsSeen(notificationId: string): Promise<void> {
//     await this.chatRepository.markNotificationSeen(notificationId);
//   }
// }
