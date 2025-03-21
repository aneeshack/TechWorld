import { Router } from "express";

import { ChatRepository } from "../repository/chatRepository";
import { ChatService } from "../services/chatService";
import { ChatController } from "../controllers/chatController";
import { authenticateUser } from "../middlewares/authMiddleware";

const chatRouter = Router();
const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

chatRouter.post('/access',authenticateUser, chatController.accessChat.bind(chatController));
chatRouter.get('/:senderId/:receiverId',authenticateUser, chatController.getMessages.bind(chatController));
chatRouter.get('/all/messages/:userId',authenticateUser, chatController.getUserMessages.bind(chatController));
chatRouter.put('/seen',authenticateUser, chatController.markMessagesSeen.bind(chatController));
chatRouter.get('/new/notifications/:userId',authenticateUser, chatController.getNotifications.bind(chatController));


chatRouter.put('/notification/seen',authenticateUser, chatController.markNotificationsAsSeen.bind(chatController));

chatRouter.get('/instructor/meesagedStudent/:instructorId',authenticateUser, chatController.getMessagedStudents.bind(chatController));


export default chatRouter;











// import { Router } from "express";

// import { ChatRepository } from "../repository/chatRepository";
// import { ChatService } from "../services/chatService";
// import { ChatController } from "../controllers/chatController";


// const chatRouter = Router();
// const chatRepository = new ChatRepository();
// const chatService = new ChatService(chatRepository);
// const chatController = new ChatController(chatService);

// chatRouter.post('/access',chatController.accessChat.bind(chatController));
// chatRouter.get('/:senderId/:receiverId', chatController.getMessages.bind(chatController));
// chatRouter.get('/all/messages/:userId', chatController.getUserMessages.bind(chatController));
// chatRouter.put('/seen', chatController.markMessagesSeen.bind(chatController));
// chatRouter.get('/new/notifications/:userId', chatController.getNotifications.bind(chatController));


// chatRouter.put('/notification/seen', chatController.markNotificationsAsSeen.bind(chatController));

// chatRouter.get('/instructor/meesagedStudent/:instructorId', chatController.getMessagedStudents.bind(chatController));


// export default chatRouter;