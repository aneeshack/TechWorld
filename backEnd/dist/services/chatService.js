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
exports.ChatService = void 0;
const mongoose_1 = require("mongoose");
class ChatService {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    getUserMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._chatRepository.getUserMessages(userId);
            }
            catch (error) {
                console.error("chat service error:get user messages", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    accessChat(userId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !receiverId) {
                    throw new Error("UserId and receiverId are required");
                }
                const existingChat = yield this._chatRepository.findChatByUsers(userId, receiverId);
                if (existingChat)
                    return existingChat;
                return yield this._chatRepository.createChat(userId, receiverId);
            }
            catch (error) {
                console.error("chat service error:access chat", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    saveMessage(sender, reciever, content, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside save message');
                let chat = yield this._chatRepository.findChatByUsers(sender, reciever);
                if (!chat) {
                    chat = yield this._chatRepository.createChat(sender, reciever);
                }
                if (!(chat === null || chat === void 0 ? void 0 : chat._id)) {
                    throw new Error('no chat id');
                }
                const newMessage = yield this._chatRepository.createMessage({
                    sender,
                    reciever,
                    content,
                    contentType,
                    chatId: chat._id,
                });
                if (!(newMessage === null || newMessage === void 0 ? void 0 : newMessage._id)) {
                    throw new Error('no message id');
                }
                yield this._chatRepository.updateChatLatestMessage(chat._id, newMessage._id);
                const existingNotification = yield this._chatRepository.findNotification(sender, reciever);
                if (!existingNotification) {
                    yield this._chatRepository.createNotification(reciever, sender, newMessage._id.toString(), chat._id.toString(), false);
                }
                else {
                    yield this._chatRepository.updateNotification(existingNotification._id.toString(), { isSeen: false, message: new mongoose_1.Types.ObjectId(newMessage._id.toString()) });
                }
                const populatedMessage = yield this._chatRepository.getPopulatedMessage(new mongoose_1.Types.ObjectId(newMessage._id.toString()));
                if (!populatedMessage) {
                    throw new Error("Message not found");
                }
                console.log('populated message', populatedMessage);
                return populatedMessage;
            }
            catch (error) {
                console.log("chat service error: send message", error);
                throw new Error(`${error.message}`);
            }
        });
    }
}
exports.ChatService = ChatService;
