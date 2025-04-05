"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authContainer = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../interfaces/types");
const authRepository_1 = require("../repository/authRepository");
const authService_1 = require("../services/authService");
const authController_1 = require("../controllers/authController");
const authContainer = new inversify_1.Container();
exports.authContainer = authContainer;
// Bind dependencies
authContainer.bind(types_1.AUTH_TYPES.AuthRepository).to(authRepository_1.AuthRepository).inSingletonScope();
authContainer.bind(types_1.AUTH_TYPES.AuthService).to(authService_1.AuthService).inSingletonScope();
authContainer.bind(types_1.AUTH_TYPES.AuthController).to(authController_1.AuthController).inSingletonScope();
