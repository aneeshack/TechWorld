
import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { DiscussionRepository } from "../repository/discussionRepository";
import { DiscussionService } from "../services/discussionService";
import { DiscussionController } from "../controllers/discussionController";

const discussionRouter = Router()
const discussionRepository = new DiscussionRepository();
const discussionService = new DiscussionService(discussionRepository);
const discussionController = new DiscussionController(discussionService);



// discussion forum routes
discussionRouter.post('/',authenticateUser,discussionController.createDiscussion.bind(discussionController))
discussionRouter.get('/',authenticateUser,discussionController.getDiscussions.bind(discussionController))
discussionRouter.patch('/upvote/:id',authenticateUser,discussionController.upvoteDiscussion.bind(discussionController))

// discussionRouter.patch('/:id/resolved',authenticateUser,discussionController.markAsResolved.bind(discussionController))

discussionRouter.post('/reply',authenticateUser,discussionController.createReply.bind(discussionController))


export default discussionRouter;