import { Types } from "mongoose";
import { IChatRepository } from "../interfaces/chat/IChatRepository";
import { IMessage } from "../interfaces/database/IMessage";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModel";
import { IChat } from "../interfaces/database/IChat";


export class ChatRepository implements IChatRepository{


    async findChatBetweenUsers(userId: string, receiverId: string): Promise<IChat> {
         try {
          const chat = await chatModel.findOne({
            isGroupChat: false,
            users: { 
              $all: [
                new Types.ObjectId(userId), 
                new Types.ObjectId(receiverId)
              ] 
            }
          }).populate('users', 'userName email avatar');

          if(!chat){
            throw new Error('no chat found')
          }
          return chat
         } catch (error) {
             console.log("chat Repository error: find chat", error);
             throw new Error(` ${(error as Error).message}`);
         }
     }

     async createChat(userId: string, receiverId: string): Promise<IChat> {
      try {
        const newChat = await chatModel.create({
          isGroupChat: false,
          users: [userId, receiverId]
        });
    
        const chat =  await chatModel.findById(newChat._id)
          .populate('users', 'userName email avatar');
      
          if(!chat){
            throw new Error('no chat found')
          }
          return chat
      } catch (error) {
          console.log("chat Repository error: access chat", error);
          throw new Error(` ${(error as Error).message}`);
      }
  }

  
  async findChatByUsers(sender: string, receiver: string): Promise<IChat | null> {
    return chatModel.findOne({
      isGroupChat: false,
      users: {
        $all: [new Types.ObjectId(sender), new Types.ObjectId(receiver)],
      },
    });
  }
  
}

// import { Types } from "mongoose";
// import { chatModel } from "../models/chatModel";
// import { messageModel } from "../models/messageModel";
// import { notificationModel } from "../models/notificationModel";
// import { IChat } from "../interfaces/database/IChat";
// import { IMessage } from "../interfaces/database/IMessage";
// import { INotification } from "../interfaces/database/INotification";

// export class ChatRepository {
//   async findChatByUsers(userId: string, receiverId: string): Promise<IChat | null> {
//     return chatModel.findOne({
//       isGroupChat: false,
//       users: { $all: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)] }
//     });
//   }

//   async createChat(users: string[]): Promise<IChat> {
//     return chatModel.create({
//       isGroupChat: false,
//       users
//     });
//   }

//   async getPopulatedChat(chatId: Types.ObjectId): Promise<IChat | null> {
//     let chat = chatModel.findById(chatId).populate('users', 'userName email avatar');
//     if(!chat){
//       throw new Error('chat not found')
//     }
//     return chat
//   }

//   async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
//     return messageModel.create(messageData);
//   }

//   async updateChatLatestMessage(chatId: Types.ObjectId, messageId: Types.ObjectId): Promise<IChat | null> {
//     return chatModel.findByIdAndUpdate(chatId, { latestMessage: messageId }, { new: true });
//   }

//   async deleteNotifications(sender: string, recipient: string): Promise<void> {
//     await notificationModel.deleteMany({ sender, recipient });
//   }

//   async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
//     return notificationModel.create(notificationData);
//   }

//   async getPopulatedMessage(messageId: Types.ObjectId): Promise<IMessage | null> {
//     return messageModel
//       .findById(messageId)
//       .populate('sender', 'userName profilePicture')
//       .populate('reciever', 'userName profilePicture')
//       .populate('chatId');
//   }

//   async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
//     return messageModel
//       .find({ chatId })
//       .populate('sender', 'userName avatar')
//       .populate('reciever', 'userName avatar')
//       .sort({ createdAt: 1 });
//   }

//   async markMessagesSeen(chatId: string, userId: string): Promise<void> {
//     await messageModel.updateMany(
//       { chatId, reciever: userId, recieverSeen: false },
//       { recieverSeen: true }
//     );
//   }

//   async getUserChats(userId: string): Promise<IChat[]> {
//     return chatModel
//       .find({ users: { $elemMatch: { $eq: new Types.ObjectId(userId) } } })
//       .populate('users', 'userName email profilePicture')
//       .populate('latestMessage')
//       .sort({ updatedAt: -1 });
//   }

//   async getMessagedStudents(instructorId: string): Promise<any[]> {
//     return messageModel
//       .find({ reciever: instructorId })
//       .populate('sender', 'userName email profile.avatar');
//   }

//   async getNotifications(userId: string): Promise<INotification[]> {
//     return notificationModel
//       .find({ recipient: userId, isSeen: false })
//       .sort({ createdAt: -1 });
//   }

//   async markNotificationSeen(notificationId: string): Promise<void> {
//     await notificationModel.updateOne(
//       { _id: notificationId },
//       { isSeen: true }
//     );
//     await notificationModel.deleteOne({ _id: notificationId });
//   }
// }