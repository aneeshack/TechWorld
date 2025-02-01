import { Router } from "express";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { UserController } from "../controllers/userController";
import asyncHandler from "express-async-handler";

// const userRepository = new UserRepository()
// const userService = new UserService(userRepository)
// const userController = new UserController(userService, userRepository)


// const userRouter = Router()


// userRouter.post('/signup',asyncHandler(userController.createUser.bind(userController)))

// export default userRouter

const userRouter = Router();
const userController = new UserController();

userRouter.post('/signup', userController.signup.bind(userController));

export default userRouter;