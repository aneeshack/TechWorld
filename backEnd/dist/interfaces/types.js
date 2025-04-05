"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_TYPES = exports.AUTH_TYPES = void 0;
exports.AUTH_TYPES = {
    AuthRepository: Symbol.for("AuthRepository"),
    AuthService: Symbol.for("AuthService"),
    AuthController: Symbol.for("AuthController"),
};
exports.USER_TYPES = {
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),
    PaymentRepository: Symbol.for("PaymentRepository"),
};
