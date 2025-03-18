import { Types } from "mongoose";
import { IChatRepository } from "../interfaces/chat/IChatRepository";
import { IMessage } from "../interfaces/database/IMessage";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModel";
import { IChat } from "../interfaces/database/IChat";
import { notificationModel } from "../models/notificationModel";
import { INotification } from "../interfaces/database/INotification";


export class ChatRepository implements IChatRepository{

  async getUserMessages(userId: string): Promise<IMessage | null> {
    try {
      return await messageModel
      .findOne({
        $or: [{ sender: userId }, { reciever: userId }],
      })
      .sort({ createdAt: -1 }) 
      .populate("sender", "userName")
      .populate("reciever", "userName")
      .exec();
  
    } catch (error) {
        console.log("chat Repository error: get user messages", error);
        throw new Error(` ${(error as Error).message}`);
    }
}


    async findChatByUsers(userId: string, receiverId: string): Promise<IChat> {
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
          console.log("chat Repository error: create chat", error);
          throw new Error(` ${(error as Error).message}`);
      }
  }

  async createMessage(messageData: Partial<IMessage>): Promise<IMessage | null> {
    try {
      const message = await messageModel.create(messageData)
    
        if(!message){
          throw new Error('no message found')
        }
        return message
    } catch (error) {
        console.log("message Repository error: create message", error);
        throw new Error(` ${(error as Error).message}`);
    }
}

async updateChatLatestMessage(chatId: string, messageId: string): Promise<IChat | null> {
  try {
    const updateChat = await chatModel.findByIdAndUpdate(chatId, { latestMessage: messageId }, { new: true });
  
      if(!updateChat){
        throw new Error('no update message found')
      }
      return updateChat
  } catch (error) {
      console.log("message Repository error: update latest message", error);
      throw new Error(` ${(error as Error).message}`);
  }
}

async findNotification(sender: string, recipient: string): Promise<INotification | null> {
  try {
    return notificationModel
        .findOne({ recipient, sender, isSeen: false })
        .sort({ createdAt: -1 });
    
  } catch (error) {
      console.log("message Repository error: find notification", error);
      throw new Error(` ${(error as Error).message}`);
  }
}


async createNotification(recipient: string, sender: string, message: string, chat: string, isSeen: boolean): Promise<INotification | null> {
  try {
    const notification = await notificationModel.create({recipient,sender,message,chat,isSeen});
    if(!notification){
      throw new Error('error in creating notification')
    }
    return notification
  } catch (error) {
      console.log("message Repository error: create notification", error);
      throw new Error(` ${(error as Error).message}`);
  }
}

async updateNotification(notificationId: string, updateData: Partial<INotification>): Promise<INotification | null> {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { $set: updateData }, // Only update the fields provided
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      throw new Error('Notification not found or update failed');
    }

    return updatedNotification;
  } catch (error) {
    console.error("message Repository error: update notification", error);
    throw new Error(` ${(error as Error).message}`);
  }
}


async getPopulatedMessage(messageId: Types.ObjectId): Promise<IMessage | null> {
  try {

    const message = await messageModel.findById(messageId)
    // .populate('sender', 'userName email avatar')
    // .populate('reciever', 'userName email avatar')
    // .populate('chatId', 'users latestMessage');

  if (!message) throw new Error('message not found');

  return message;
  } catch (error) {
    console.error("message Repository error: update chat", error);
    throw new Error(` ${(error as Error).message}`);
  }
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