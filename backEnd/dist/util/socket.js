"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const chatService_1 = require("../services/chatService");
const chatRepository_1 = require("../repository/chatRepository");
const onlineUsers = {};
const initializeSocket = (io) => {
    const chatRepository = new chatRepository_1.ChatRepository();
    const chatService = new chatService_1.ChatService(chatRepository);
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        socket.on("get_online_users", (userId) => {
            const onlineUsersList = Object.keys(onlineUsers).reduce((acc, key) => {
                acc[key] = onlineUsers[key].length > 0;
                return acc;
            }, {});
            socket.emit("initial_online_users", onlineUsersList);
        });
        // Join a room based on user ID
        socket.on("join_room", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            if (!userId) {
                console.log("user joinged");
                socket.emit("error", { message: "User ID is required" });
                return;
            }
            socket.join(userId);
            if (!onlineUsers[userId])
                onlineUsers[userId] = [];
            if (!onlineUsers[userId].includes(socket.id)) {
                onlineUsers[userId].push(socket.id);
            }
            const onlineUsersList = Object.keys(onlineUsers).reduce((acc, key) => {
                acc[key] = onlineUsers[key].length > 0;
                return acc;
            }, {});
            io.emit("online_status", { userId, isOnline: true });
            io.emit("initial_online_users", onlineUsersList);
            try {
                const latestMessages = yield chatService.getUserMessages(userId);
                socket.emit("user_data", latestMessages);
            }
            catch (error) {
                console.error("Error fetching user data:", error);
                socket.emit("error", { message: "Failed to load user data" });
            }
        }));
        // handle send message
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { sender, reciever, content, contentType } = data;
            try {
                const newMessage = yield chatService.saveMessage(sender, reciever, content, contentType);
                // Emit the message to the reciever's room
                io.to(sender).emit("receiveMessage", newMessage);
                io.to(reciever).emit("receiveMessage", newMessage);
                io.to(reciever).emit("receiveNotification", {
                    type: "message",
                    sender,
                    message: (newMessage === null || newMessage === void 0 ? void 0 : newMessage.content) || "You have a new message",
                });
            }
            catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageSent", { success: false, error });
            }
        }));
        // video call management
        socket.on("callUser", ({ callerId, receiverId, roomName, callerName }) => {
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
        socket.on("leave_room", (userId) => {
            if (!userId)
                return;
            console.log("leave rom");
            socket.leave(userId);
            if (onlineUsers[userId]) {
                onlineUsers[userId] = onlineUsers[userId].filter((id) => id !== socket.id);
                if (onlineUsers[userId].length === 0) {
                    delete onlineUsers[userId];
                    io.emit("online_status", { userId, isOnline: false });
                }
            }
            console.log(`User ${userId} left their room. Online users:`, onlineUsers);
        });
        socket.on("disconnect", () => {
            const userId = Object.keys(onlineUsers).find((key) => onlineUsers[key].includes(socket.id));
            if (userId) {
                onlineUsers[userId] = onlineUsers[userId].filter((id) => id !== socket.id);
                if (onlineUsers[userId].length === 0) {
                    delete onlineUsers[userId];
                    io.emit("online_status", { userId, isOnline: false });
                    console.log(`Emitted online_status for ${userId} offline at ${Date.now()}`);
                }
            }
        });
    });
};
exports.initializeSocket = initializeSocket;
