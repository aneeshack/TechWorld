import { Server as SocketIOServer, Socket } from "socket.io";
import { notificationModel } from "../models/notificationModel";
import { ChatService } from "../services/chatService";
import { ChatRepository } from "../repository/chatRepository";
import { IMessage } from "../interfaces/database/IMessage";

const onlineUsers: { [userId: string]: string[] } = {};

export const initializeSocket = (io: SocketIOServer) => {
  const chatRepository = new ChatRepository();
  const chatService = new ChatService(chatRepository);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("get_online_users", (userId) => {
      const onlineUsersList = Object.keys(onlineUsers).reduce(
        (acc: any, key: any) => {
          acc[key] = onlineUsers[key].length > 0;
          return acc;
        },
        {}
      );
      console.log(
        `Sending initial_online_users to ${userId}:`,
        onlineUsersList
      );
      socket.emit("initial_online_users", onlineUsersList);
    });

    // Join a room based on user ID
    socket.on("join_room", async (userId: string) => {
      if (!userId) {
        console.log("user joinged");
        socket.emit("error", { message: "User ID is required" });
        return;
      }

      socket.join(userId);
      if (!onlineUsers[userId]) onlineUsers[userId] = [];
      if (!onlineUsers[userId].includes(socket.id)) {
        onlineUsers[userId].push(socket.id);
      }

      const onlineUsersList = Object.keys(onlineUsers).reduce((acc, key) => {
        acc[key] = onlineUsers[key].length > 0;
        return acc;
      }, {} as { [key: string]: boolean });

      io.emit("online_status", { userId, isOnline: true });

      io.emit("initial_online_users", onlineUsersList);

      try {
        const latestMessages = await chatService.getUserMessages(userId);
        console.log("latest messaes", latestMessages);
        socket.emit("user_data", latestMessages);
      } catch (error) {
        console.error("Error fetching user data:", error);
        socket.emit("error", { message: "Failed to load user data" });
      }
    });

    // handle send message
    socket.on("sendMessage", async (data) => {
      console.log("inside send message", socket.id, data);
      const { sender, reciever, content, contentType } = data;
      try {
        const newMessage:IMessage = await chatService.saveMessage(
          sender,
          reciever,
          content,
          contentType
        );
        console.log("new message after update database", newMessage);

        // Emit the message to the reciever's room
        io.to(sender).emit("receiveMessage", newMessage);
        io.to(reciever).emit("receiveMessage", newMessage);
        console.log(`Message sent from ${sender} to ${reciever}`);

        // Emit a notification to the receiver
        console.log("recieve notification ", sender);
        io.to(reciever).emit("receiveNotification", {
          type: "message",
          sender,
          message: newMessage?.content ||"You have a new message",
        });

        // Notify sender that the message was sent
        // socket.emit("messageSent", { success: true });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageSent", { success: false, error });
      }
    });

    // video call management
    socket.on("callUser", ({ callerId, receiverId, roomName, callerName }) => {
      console.log("calluser", callerId, receiverId, roomName, callerName);
      io.to(receiverId).emit("incomingCall", {
        callerId,
        roomName,
        callerName,
      });
    });

    // reject video call
    socket.on("callRejected", ({ callerId }) => {
      console.log("call Rejected", callerId);
      io.to(callerId).emit("callRejected");
    });

    socket.on("callEnded", ({ roomName }) => {
      console.log("call ended", roomName);
      io.emit("callEnded", { roomName });
    });

    // Listen for typing event
    socket.on("typing", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("typing", senderId); // Notify receiver
    });

    // Listen for stop typing event
    socket.on("stop_typing", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("stop_typing", senderId); // Notify receiver
    });

    socket.on("leave_room", (userId: string) => {
      if (!userId) return;
      console.log("leave rom");
      socket.leave(userId);
      if (onlineUsers[userId]) {
        onlineUsers[userId] = onlineUsers[userId].filter(
          (id) => id !== socket.id
        );
        if (onlineUsers[userId].length === 0) {
          delete onlineUsers[userId];
          io.emit("online_status", { userId, isOnline: false });
        }
      }
      console.log(`User ${userId} left their room. Online users:`, onlineUsers);
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(onlineUsers).find((key) =>
        onlineUsers[key].includes(socket.id)
      );
      if (userId) {
        onlineUsers[userId] = onlineUsers[userId].filter(
          (id) => id !== socket.id
        );
        if (onlineUsers[userId].length === 0) {
          delete onlineUsers[userId];
          io.emit("online_status", { userId, isOnline: false });
          console.log(
            `Emitted online_status for ${userId} offline at ${Date.now()}`
          );
        }
      }
    });
  });
};
