import { Server as SocketIOServer, Socket } from "socket.io";
import { notificationModel } from "../models/notificationModel";


export const initializeSocket = (io: SocketIOServer) => {

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Join a room based on user ID
    socket.on("join_room", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });


    socket.on(
      "sendMessage",
      async (data) => {
        console.log('inside send message',socket.id,data)
        const{ sender, reciever, content, contentType }: { sender: string; reciever: string; content: string, contentType:string }= data
        try {

          const newMessage = {
            sender,
            reciever,
            content,
            contentType,
          }

          // Emit the message to the reciever's room
          io.to(sender).emit("receiveMessage",newMessage);
          io.to(reciever).emit("receiveMessage",newMessage);
          console.log(`Message sent from ${sender} to ${reciever}`);



        // Emit a notification to the receiver
        console.log('recieve notification ',sender)
        io.to(reciever).emit("receiveNotification", {
          type: "message",
          sender,
          message: newMessage.content ||"You have a new message",
        });
      
          // Notify sender that the message was sent
          // socket.emit("messageSent", { success: true });
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("messageSent", { success: false, error });
        }
      }
    );


    socket.on("callUser", ({ callerId, receiverId, roomName, callerName }) => {
      console.log('calluser',callerId, receiverId, roomName, callerName)
      io.to(receiverId).emit("incomingCall", { callerId, roomName, callerName });
  });

  socket.on("callRejected", ({ callerId }) => {
    console.log('call Rejected',callerId)

      io.to(callerId).emit("callRejected");
  });

  socket.on("callEnded", ({ roomName }) => {
    console.log('call ended',roomName)
      io.emit("callEnded", { roomName });
  });
   

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
