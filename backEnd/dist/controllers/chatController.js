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
exports.ChatController = void 0;
const chatModel_1 = require("../models/chatModel");
const messageModel_1 = require("../models/messageModel");
const mongoose_1 = require("mongoose");
const notificationModel_1 = require("../models/notificationModel");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    getUserMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw new Error('no user found');
                }
                const messages = yield this._chatService.getUserMessages(userId);
                res.status(200).json({
                    success: true,
                    data: messages,
                });
            }
            catch (error) {
                console.error("Error fetching user messages:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error,
                });
            }
        });
    }
    accessChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, receiverId } = req.body;
                if (!userId || !receiverId) {
                    res.status(400).json({
                        success: false,
                        message: 'UserId and receiverId are required'
                    });
                    return;
                }
                // Check if chat already exists between the two users
                const existingChat = yield chatModel_1.chatModel.findOne({
                    isGroupChat: false,
                    users: {
                        $all: [
                            new mongoose_1.Types.ObjectId(userId),
                            new mongoose_1.Types.ObjectId(receiverId)
                        ]
                    }
                }).populate('users', 'userName email profile.avatar');
                if (existingChat) {
                    res.status(200).json({
                        success: true,
                        data: existingChat
                    });
                    return;
                }
                // Create new chat
                const newChat = yield chatModel_1.chatModel.create({
                    isGroupChat: false,
                    users: [userId, receiverId]
                });
                // Populate user details for the response
                const fullChat = yield chatModel_1.chatModel.findById(newChat._id)
                    .populate('users', 'userName email avatar');
                res.status(201).json({
                    success: true,
                    data: fullChat
                });
                return;
            }
            catch (error) {
                console.error('Error in accessChat:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
                return;
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('send message', req.body);
                const { sender, reciever, content, contentType = 'text' } = req.body;
                if (!sender || !reciever || !content) {
                    (0, errorMiddleware_1.throwError)(400, "Sender, receiver and content are required.");
                }
                // Find or create chat between sender and receiver
                let chat = yield chatModel_1.chatModel.findOne({
                    isGroupChat: false,
                    users: {
                        $all: [
                            new mongoose_1.Types.ObjectId(sender),
                            new mongoose_1.Types.ObjectId(reciever)
                        ]
                    }
                });
                // If chat doesn't exist, create one
                if (!chat) {
                    chat = yield chatModel_1.chatModel.create({
                        isGroupChat: false,
                        users: [sender, reciever]
                    });
                }
                // Create new message
                const newMessage = yield messageModel_1.messageModel.create({
                    sender,
                    reciever,
                    content,
                    contentType,
                    chatId: chat._id
                });
                // Update the latest message in chat
                yield chatModel_1.chatModel.findByIdAndUpdate(chat._id, {
                    latestMessage: newMessage._id
                });
                yield notificationModel_1.notificationModel.deleteMany({
                    sender: sender,
                    recipient: reciever,
                });
                const notification = yield notificationModel_1.notificationModel.create({
                    recipient: reciever,
                    sender,
                    message: newMessage._id,
                    chat: chat._id,
                    isSeen: false,
                });
                console.log('notification', notification);
                // Populate user info for the response
                const populatedMessage = yield messageModel_1.messageModel.findById(newMessage._id)
                    .populate('sender', 'userName profilePicture')
                    .populate('reciever', 'userName profilePicture')
                    .populate('chatId');
                res.status(201).json({
                    success: true,
                    data: populatedMessage
                });
                return;
            }
            catch (error) {
                console.error('Error in sendMessage:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
                return;
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get messages', req.params);
                const { senderId, receiverId } = req.params;
                // Find the chat between sender and receiver
                const chat = yield chatModel_1.chatModel.findOne({
                    isGroupChat: false,
                    users: {
                        $all: [
                            new mongoose_1.Types.ObjectId(senderId),
                            new mongoose_1.Types.ObjectId(receiverId)
                        ]
                    }
                });
                if (!chat) {
                    res.status(200).json({
                        success: true,
                        data: [] // No chat exists yet, return empty array
                    });
                    return;
                }
                yield messageModel_1.messageModel.updateMany({
                    chatId: chat._id,
                    sender: senderId,
                    reciever: receiverId,
                    recieverSeen: false
                }, { $set: { recieverSeen: true } });
                yield notificationModel_1.notificationModel.updateMany({
                    chat: chat._id,
                    sender: senderId,
                    recipient: receiverId,
                    isSeen: false
                }, { $set: { isSeen: true } });
                console.log('status changed notification');
                const messages = yield messageModel_1.messageModel.find({ chatId: chat._id })
                    .populate('sender', 'userName profile.avatar')
                    .populate('reciever', 'userName profile.avatar')
                    .sort({ createdAt: 1 });
                res.status(200).json({
                    success: true,
                    data: messages
                });
            }
            catch (error) {
                console.error('Error in getMessages:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
            }
        });
    }
    markMessagesSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, userId } = req.body;
                yield messageModel_1.messageModel.updateMany({
                    chatId,
                    reciever: userId,
                    recieverSeen: false
                }, { recieverSeen: true });
                res.status(200).json({
                    success: true,
                    message: 'Messages marked as seen'
                });
            }
            catch (error) {
                console.error('Error in markMessagesSeen:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
            }
        });
    }
    getUserChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const chats = yield chatModel_1.chatModel.find({
                    users: { $elemMatch: { $eq: new mongoose_1.Types.ObjectId(userId) } }
                })
                    .populate('users', 'userName email profilePicture')
                    .populate('latestMessage')
                    .sort({ updatedAt: -1 });
                // Populate sender info in latest message
                const populatedChats = yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                    if (chat.latestMessage) {
                        const message = yield messageModel_1.messageModel.findById(chat.latestMessage)
                            .populate('sender', 'userName profilePicture');
                        return Object.assign(Object.assign({}, chat.toObject()), { latestMessage: message });
                    }
                    return chat;
                })));
                res.status(200).json({
                    success: true,
                    data: populatedChats
                });
            }
            catch (error) {
                console.error('Error in getUserChats:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
            }
        });
    }
    getMessagedStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructorId = req.params.instructorId;
                // Find messages where the instructor is the receiver
                const messages = yield messageModel_1.messageModel.find({ reciever: instructorId })
                    .populate('sender', 'userName email profile.avatar');
                // Extract unique student senders
                const uniqueStudents = Array.from(new Map(messages.map(msg => { var _a; return [(_a = msg === null || msg === void 0 ? void 0 : msg.sender) === null || _a === void 0 ? void 0 : _a.toString(), msg.sender]; })).values());
                console.log('unique students', uniqueStudents);
                res.status(200).json({
                    success: true,
                    data: uniqueStudents
                });
            }
            catch (error) {
                console.error('Error in getMessagedStudents:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error
                });
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside notifications', req.params);
                const userId = req.params.userId;
                // Fetch unread notifications for the user
                const notifications = yield notificationModel_1.notificationModel
                    .find({ recipient: userId, isSeen: false })
                    .sort({ createdAt: -1 });
                console.log('notifications', notifications);
                res.status(200).json({ success: true, data: notifications });
            }
            catch (error) {
                console.error("Error fetching notifications:", error);
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    markNotificationsAsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.body;
            console.log('notificaiid', req.body);
            try {
                yield notificationModel_1.notificationModel.updateOne({ _id: notificationId }, { $set: { isSeen: true } });
                yield notificationModel_1.notificationModel.deleteOne({ _id: notificationId });
                res.status(200).json({ message: "Notification marked as seen" });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to update the notification";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
}
exports.ChatController = ChatController;
