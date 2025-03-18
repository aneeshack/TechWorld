import { Router } from "express";

import { ChatRepository } from "../repository/chatRepository";
import { ChatService } from "../services/chatService";
import { ChatController } from "../controllers/chatController";

const chatRouter = Router();
const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

chatRouter.post('/access', chatController.accessChat.bind(chatController));
// chatRouter.get('/user/:userId', chatController.getUserChats.bind(chatController));
chatRouter.post('/', chatController.sendMessage.bind(chatController));
chatRouter.get('/:senderId/:receiverId', chatController.getMessages.bind(chatController));
chatRouter.get('/all/messages/:userId', chatController.getUserMessages.bind(chatController));
chatRouter.put('/seen', chatController.markMessagesSeen.bind(chatController));
chatRouter.get('/new/notifications/:userId', chatController.getNotifications.bind(chatController));


chatRouter.put('/notification/seen', chatController.markNotificationsAsSeen.bind(chatController));

chatRouter.get('/instructor/meesagedStudent/:instructorId', chatController.getMessagedStudents.bind(chatController));


export default chatRouter;