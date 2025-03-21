import { Request, Response } from "express";
import { ChatService } from "../services/chatService";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModel";
import { Types } from "mongoose";
import { notificationModel } from "../models/notificationModel";

export class ChatController{
    constructor(private chatService: ChatService){}

    async getUserMessages(req: Request, res: Response): Promise<void> {
      console.log('inside get user message')
      try {
        const { userId } = req.params;
        if(!userId){
          throw new Error('no user found')
        }
        const messages = await this.chatService.getUserMessages(userId);
  
        res.status(200).json({
          success: true,
          data: messages,
        });
      } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error,
        });
      }
    }

async accessChat(req: Request, res: Response):Promise<void> {
  try {
    console.log('req.body',req.body)
    const { userId, receiverId } = req.body;
    
    if (!userId || !receiverId) {
        res.status(400).json({ 
        success: false, 
        message: 'UserId and receiverId are required' 
      });
      return
    }

    // Check if chat already exists between the two users
    const existingChat = await chatModel.findOne({
      isGroupChat: false,
      users: { 
        $all: [
          new Types.ObjectId(userId), 
          new Types.ObjectId(receiverId)
        ] 
      }
    }).populate('users', 'userName email profile.avatar');

    if (existingChat) {
        res.status(200).json({
        success: true,
        data: existingChat
      });
      return
    }

    // Create new chat
    const newChat = await chatModel.create({
      isGroupChat: false,
      users: [userId, receiverId]
    });

    // Populate user details for the response
    const fullChat = await chatModel.findById(newChat._id)
      .populate('users', 'userName email avatar');

      res.status(201).json({
      success: true,
      data: fullChat
    });
    return
  } catch (error) {
    console.error('Error in accessChat:', error);
      res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error
    });
    return
  }
}

async sendMessage(req: Request, res: Response):Promise<void> {
  try {
    console.log('send message',req.body)
    const { sender, reciever, content, contentType = 'text' } = req.body;

    if (!sender || !reciever || !content) {
        res.status(400).json({
        success: false,
        message: 'Sender, receiver and content are required'
      });
      return
    }

    // Find or create chat between sender and receiver
    let chat = await chatModel.findOne({
      isGroupChat: false,
      users: {
        $all: [
          new Types.ObjectId(sender),
          new Types.ObjectId(reciever)
        ]
      }
    });

    // If chat doesn't exist, create one
    if (!chat) {
      chat = await chatModel.create({
        isGroupChat: false,
        users: [sender, reciever]
      });
    }

    // Create new message
    const newMessage = await messageModel.create({
      sender,
      reciever,
      content,
      contentType,
      chatId: chat._id
    });

    // Update the latest message in chat
    await chatModel.findByIdAndUpdate(chat._id, {
      latestMessage: newMessage._id
    });

    await notificationModel.deleteMany({
      sender: sender,
      recipient: reciever,
    });
    
    const notification = await notificationModel.create({
      recipient: reciever,
      sender,
      message: newMessage._id,
      chat: chat._id,
      isSeen: false, 
    });
    console.log('notification',notification)

    // Populate user info for the response
    const populatedMessage = await messageModel.findById(newMessage._id)
      .populate('sender', 'userName profilePicture')
      .populate('reciever', 'userName profilePicture')
      .populate('chatId');

      res.status(201).json({
      success: true,
      data: populatedMessage
    });
    return
  } catch (error) {
    console.error('Error in sendMessage:', error);
      res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error
    });
    return
  }
}


async getMessages(req: Request, res: Response):Promise<void> {
  try {
    console.log('get messages',req.params)
    const { senderId, receiverId } = req.params;

    // Find the chat between sender and receiver
    const chat = await chatModel.findOne({
      isGroupChat: false,
      users: {
        $all: [
          new Types.ObjectId(senderId),
          new Types.ObjectId(receiverId)
        ]
      }
    });

    if (!chat) {
        res.status(200).json({
        success: true,
        data: [] // No chat exists yet, return empty array
      });
      return
    }
    await messageModel.updateMany(
      { 
        chatId:chat._id,
        sender:senderId,
        reciever: receiverId,
        recieverSeen: false
      },
      { $set: { recieverSeen: true } }
    );
    const notifications = await notificationModel.updateMany({
      chat:chat._id,
      sender:senderId,
      recipient:receiverId,
      isSeen:false
    },{$set: { isSeen: true }})

    console.log('status changed notification')
    const messages = await messageModel.find({ chatId: chat._id })
      .populate('sender', 'userName profile.avatar')
      .populate('reciever', 'userName profile.avatar')
      .sort({ createdAt: 1 });

      res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
      res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error
    });
  }
}


async markMessagesSeen(req: Request, res: Response):Promise<void> {
  try {
    const { chatId, userId } = req.body;

    await messageModel.updateMany(
      { 
        chatId,
        reciever: userId,
        recieverSeen: false
      },
      { recieverSeen: true }
    );

      res.status(200).json({
      success: true,
      message: 'Messages marked as seen'
    });
  } catch (error) {
    console.error('Error in markMessagesSeen:', error);
      res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error
    });
  }
  }



    async getUserChats (req: Request, res: Response):Promise<void> {
    try {
      const userId = req.params.userId;
      
      const chats = await chatModel.find({
        users: { $elemMatch: { $eq: new Types.ObjectId(userId) } }
      })
        .populate('users', 'userName email profilePicture')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });

      // Populate sender info in latest message
      const populatedChats = await Promise.all(
        chats.map(async (chat) => {
          if (chat.latestMessage) {
            const message = await messageModel.findById(chat.latestMessage)
              .populate('sender', 'userName profilePicture');
            return {
              ...chat.toObject(),
              latestMessage: message
            };
          }
          return chat;
        })
      );

        res.status(200).json({
        success: true,
        data: populatedChats
      });
    } catch (error) {
      console.error('Error in getUserChats:', error);
        res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error
      });
    }
    }

    async getMessagedStudents(req: Request, res: Response): Promise<void> {
      try {
          const instructorId = req.params.instructorId;
  
          // Find messages where the instructor is the receiver
          const messages = await messageModel.find({ reciever: instructorId })
                          .populate('sender', 'userName email profile.avatar');
                          
  
          // Extract unique student senders
          const uniqueStudents = Array.from(
              new Map(messages.map(msg => [msg?.sender?.toString(), msg.sender])).values()
          );
  
          console.log('unique students',uniqueStudents)
          res.status(200).json({
              success: true,
              data: uniqueStudents
          });
      } catch (error) {
          console.error('Error in getMessagedStudents:', error);
          res.status(500).json({
              success: false,
              message: 'Internal server error',
              error: error
          });
      }
  }

  async getNotifications(req: Request, res: Response):Promise<void> {
    try {
      console.log('inside notifications',req.params)
      const userId = req.params.userId;

      // Fetch unread notifications for the user
      const notifications = await notificationModel
        .find({ recipient: userId, isSeen: false })
        .sort({ createdAt: -1 }); 

        console.log('notifications',notifications)
       res.status(200).json({ success: true, data: notifications});
    } catch (error) {
      console.error("Error fetching notifications:", error);
       res.status(500).json({ message: "Server error" });
    }
  }
  
  // async markNotificationsAsSeen(req: Request, res: Response):Promise<void> {
  //   try {
  //     const {userId,notificationId } = req.body;
  //     console.log('inside mark notifications',userId,notificationId)

  //     if(notificationId && userId){
  //       console.log('notification not found')
  //       res.status(500).json({ success: false, message:'not authorized'})
  //       return
  //     }

  //     const updatedNotification = await notificationModel.findOneAndUpdate(
  //       {_id: notificationId, recipient: userId},
  //       {$set:{isSeen:true}},
  //       {new:true}
  //     )
  
  //       console.log('mark notifications',updatedNotification)
  //      res.status(200).json({ success: true, data: updatedNotification});
  //   } catch (error) {
  //     console.error("Error update notifications:", error);
  //      res.status(500).json({ message: "Server error" });
  //   }
  // }

  async markNotificationsAsSeen(req: Request, res: Response):Promise<void> {
    const { notificationId } = req.body;
    console.log('notificaiid',req.body)
    try {
        await notificationModel.updateOne(
            { _id: notificationId },
            { isSeen: true }
        );
        await notificationModel.deleteOne({ _id: notificationId });
        res.status(200).json({ message: "Notification marked as seen" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notification" });
    }
  }
}


// import { Request, Response } from "express";
// import { ChatService } from "../services/chatService";

// export class ChatController {
//   constructor(private chatService: ChatService) {}

//   async accessChat(req: Request, res: Response): Promise<void> {
//     try {
//       const { userId, receiverId } = req.body;
//       if (!userId || !receiverId) {
//         res.status(400).json({ success: false, message: 'UserId and receiverId are required' });
//         return;
//       }
//       const chat = await this.chatService.accessChat(userId, receiverId);
//       res.status(chat.latestMessage ? 200 : 201).json({ success: true, data: chat });
//     } catch (error) {
//       console.error('Error in accessChat:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async sendMessage(req: Request, res: Response): Promise<void> {
//     try {
//       const { sender, reciever, content, contentType = 'text' } = req.body;
//       if (!sender || !reciever || !content) {
//         res.status(400).json({ success: false, message: 'Sender, receiver and content are required' });
//         return;
//       }
//       const message = await this.chatService.sendMessage(sender, reciever, content, contentType);
//       res.status(201).json({ success: true, data: message });
//     } catch (error) {
//       console.error('Error in sendMessage:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async getMessages(req: Request, res: Response): Promise<void> {
//     try {
//       const { senderId, receiverId } = req.params;
//       const messages = await this.chatService.getMessages(senderId, receiverId);
//       res.status(200).json({ success: true, data: messages });
//     } catch (error) {
//       console.error('Error in getMessages:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async markMessagesSeen(req: Request, res: Response): Promise<void> {
//     try {
//       const { chatId, userId } = req.body;
//       await this.chatService.markMessagesSeen(chatId, userId);
//       res.status(200).json({ success: true, message: 'Messages marked as seen' });
//     } catch (error) {
//       console.error('Error in markMessagesSeen:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async getUserChats(req: Request, res: Response): Promise<void> {
//     try {
//       const { userId } = req.params;
//       const chats = await this.chatService.getUserChats(userId);
//       res.status(200).json({ success: true, data: chats });
//     } catch (error) {
//       console.error('Error in getUserChats:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async getMessagedStudents(req: Request, res: Response): Promise<void> {
//     try {
//       const { instructorId } = req.params;
//       const students = await this.chatService.getMessagedStudents(instructorId);
//       res.status(200).json({ success: true, data: students });
//     } catch (error) {
//       console.error('Error in getMessagedStudents:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async getNotifications(req: Request, res: Response): Promise<void> {
//     try {
//       const { userId } = req.params;
//       const notifications = await this.chatService.getNotifications(userId);
//       res.status(200).json({ success: true, data: notifications });
//     } catch (error) {
//       console.error('Error in getNotifications:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }

//   async markNotificationsAsSeen(req: Request, res: Response): Promise<void> {
//     try {
//       const { notificationId } = req.body;
//       await this.chatService.markNotificationsAsSeen(notificationId);
//       res.status(200).json({ success: true, message: 'Notification marked as seen' });
//     } catch (error) {
//       console.error('Error in markNotificationsAsSeen:', error);
//       res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
//   }
// }