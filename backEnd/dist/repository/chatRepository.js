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
exports.ChatRepository = void 0;
const mongoose_1 = require("mongoose");
const chatModel_1 = require("../models/chatModel");
const messageModel_1 = require("../models/messageModel");
const notificationModel_1 = require("../models/notificationModel");
class ChatRepository {
    getUserMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageModel_1.messageModel
                    .find({
                    $or: [{ sender: userId }, { reciever: userId }],
                })
                    .sort({ createdAt: -1 })
                    .populate("sender", "userName")
                    .populate("reciever", "userName")
                    .exec();
            }
            catch (error) {
                console.error("chat Repository error: get user messages", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    findChatByUsers(userId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield chatModel_1.chatModel.findOne({
                    isGroupChat: false,
                    users: {
                        $all: [
                            new mongoose_1.Types.ObjectId(userId),
                            new mongoose_1.Types.ObjectId(receiverId)
                        ]
                    }
                }).populate('users', 'userName email avatar');
                if (!chat) {
                    throw new Error('no chat found');
                }
                return chat;
            }
            catch (error) {
                console.error("chat Repository error: find chat", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    createChat(userId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newChat = yield chatModel_1.chatModel.create({
                    isGroupChat: false,
                    users: [userId, receiverId]
                });
                const chat = yield chatModel_1.chatModel.findById(newChat._id)
                    .populate('users', 'userName email avatar');
                if (!chat) {
                    throw new Error('no chat found');
                }
                return chat;
            }
            catch (error) {
                console.error("chat Repository error: create chat", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    createMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield messageModel_1.messageModel.create(messageData);
                if (!message) {
                    throw new Error('no message found');
                }
                return message;
            }
            catch (error) {
                console.error("message Repository error: create message", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    updateChatLatestMessage(chatId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateChat = yield chatModel_1.chatModel.findByIdAndUpdate(chatId, { latestMessage: messageId }, { new: true });
                if (!updateChat) {
                    throw new Error('no update message found');
                }
                return updateChat;
            }
            catch (error) {
                console.error("message Repository error: update latest message", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    findNotification(sender, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return notificationModel_1.notificationModel
                    .findOne({ recipient, sender, isSeen: false })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                console.error("message Repository error: find notification", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    createNotification(recipient, sender, message, chat, isSeen) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notificationModel_1.notificationModel.create({ recipient, sender, message, chat, isSeen });
                if (!notification) {
                    throw new Error('error in creating notification');
                }
                return notification;
            }
            catch (error) {
                console.error("message Repository error: create notification", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    updateNotification(notificationId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedNotification = yield notificationModel_1.notificationModel.findByIdAndUpdate(notificationId, { $set: updateData }, { new: true } // Return the updated document
                );
                if (!updatedNotification) {
                    throw new Error('Notification not found or update failed');
                }
                return updatedNotification;
            }
            catch (error) {
                console.error("message Repository error: update notification", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    getPopulatedMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield messageModel_1.messageModel.findById(messageId);
                // .populate('sender', 'userName email avatar')
                // .populate('reciever', 'userName email avatar')
                // .populate('chatId', 'users latestMessage');
                if (!message)
                    throw new Error('message not found');
                return message;
            }
            catch (error) {
                console.error("message Repository error: update chat", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
