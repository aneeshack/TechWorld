"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContainer = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../interfaces/types");
const userRepository_1 = require("../repository/userRepository");
const userService_1 = require("../services/userService");
const userController_1 = require("../controllers/userController");
const paymentRepository_1 = require("../repository/paymentRepository");
const userContainer = new inversify_1.Container();
exports.userContainer = userContainer;
// Bind dependencies
userContainer.bind(types_1.USER_TYPES.UserRepository).to(userRepository_1.UserRepository).inSingletonScope();
userContainer.bind(types_1.USER_TYPES.UserService).to(userService_1.UserService).inSingletonScope();
userContainer.bind(types_1.USER_TYPES.UserController).to(userController_1.UserController).inSingletonScope();
userContainer.bind(types_1.USER_TYPES.PaymentRepository).to(paymentRepository_1.PaymentRepository).inSingletonScope();
