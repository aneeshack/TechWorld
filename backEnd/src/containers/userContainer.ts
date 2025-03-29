import { Container } from "inversify";
import { USER_TYPES } from "../interfaces/types";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";
import { PaymentRepository } from "../repository/paymentRepository";

const userContainer = new Container();

// Bind dependencies
userContainer.bind<UserRepository>(USER_TYPES.UserRepository).to(UserRepository).inSingletonScope();
userContainer.bind<UserService>(USER_TYPES.UserService).to(UserService).inSingletonScope();
userContainer.bind<UserController>(USER_TYPES.UserController).to(UserController).inSingletonScope();
userContainer.bind<PaymentRepository>(USER_TYPES.PaymentRepository).to(PaymentRepository).inSingletonScope();

export { userContainer };