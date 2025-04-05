"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
const IUser_1 = require("../interfaces/database/IUser");
const jwt_1 = require("../util/auth/jwt");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const inversify_1 = require("inversify");
const types_1 = require("../interfaces/types");
let AuthController = class AuthController {
    // constructor(private _authService: IAuthService) {}
    constructor(_authService) {
        this._authService = _authService;
    }
    fetchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return (0, errorMiddleware_1.throwError)(401, "Unauthorized: No user ID found");
                }
                const user = yield this._authService.getUserById(req.user.id);
                res.status(200).json({ success: true, user });
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let roleInput;
                const { userName, email, password, confirmPassword, role } = req.body;
                if (!email || !password) {
                    return (0, errorMiddleware_1.throwError)(400, "Email and password are required.");
                }
                if (!role && !Object.values(IUser_1.Role).includes(role)) {
                    return (0, errorMiddleware_1.throwError)(400, "Invalid or missing role.");
                }
                const roleInput = role;
                const userData = {
                    userName,
                    email,
                    password,
                    confirmPassword,
                    role: roleInput,
                    isOtpVerified: false,
                };
                const result = yield this._authService.signup(userData);
                res.status(201).json({ success: true, message: result.message });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return (0, errorMiddleware_1.throwError)(400, "Email is required.");
                }
                const result = yield this._authService.resendOtp(email);
                res.status(200).json({ success: true, message: result });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return (0, errorMiddleware_1.throwError)(400, "Email and otp are required.");
                }
                const { message, token, user } = yield this._authService.verifyOtp(email, otp);
                if (!token) {
                    return (0, errorMiddleware_1.throwError)(500, "token not generated.");
                }
                (0, jwt_1.setTokenCookie)(res, token);
                res.status(200).json({ success: true, message, data: user });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside loggout');
                (0, jwt_1.clearTokenCookie)(res);
                res.status(200).json({ success: true, message: 'Logged out successfully' });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let roleInput;
                const { email, password, role } = req.body;
                if (!email || !password) {
                    return (0, errorMiddleware_1.throwError)(400, "Email and password are required.");
                }
                if (!role && !Object.values(IUser_1.Role).includes(role)) {
                    return (0, errorMiddleware_1.throwError)(400, "Invalid or missing role");
                }
                const roleInput = role;
                const userData = {
                    email,
                    password,
                    role: roleInput,
                };
                const { message, user, token } = yield this._authService.loginAction(userData);
                if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                    (0, errorMiddleware_1.throwError)(403, "Admin  you. Please contact admin.");
                }
                if (!token) {
                    return (0, errorMiddleware_1.throwError)(500, "token required.");
                }
                (0, jwt_1.setTokenCookie)(res, token);
                console.log('successful login');
                res.status(201).json({ success: true, message: message, data: user });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    googleAuthentication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials, userRole } = req.body;
                if (!userRole && !Object.values(IUser_1.Role).includes(userRole)) {
                    return (0, errorMiddleware_1.throwError)(400, "Invalid or missing role.");
                }
                const roleInput = userRole;
                const { message, user, token } = yield this._authService.googleAuth(credentials, roleInput);
                if (!token) {
                    return (0, errorMiddleware_1.throwError)(500, "token is not provided.");
                }
                (0, jwt_1.setTokenCookie)(res, token);
                res.status(200).json({ success: true, message: message, data: user });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    registerInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authService.register(req.body);
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, role } = req.body;
                if (!role && !Object.values(IUser_1.Role).includes(role)) {
                    return (0, errorMiddleware_1.throwError)(400, "Invalid or missing role.");
                }
                const user = yield this._authService.forgotPassword(email, role);
                res.status(200).json({ success: true, message: 'Otp send to your, email plase verify it.', data: user });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, role, password } = req.body;
                if (!email || !role || !password) {
                    return (0, errorMiddleware_1.throwError)(400, "All fields are required");
                }
                const result = yield this._authService.resetPassword(email, password, role);
                res.status(200).json({ success: true, message: result.message });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    verifyForgotPasswordOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return (0, errorMiddleware_1.throwError)(400, "All fields are required");
                }
                const { message } = yield this._authService.verifyForgotPasswordOtp(email, otp);
                res.status(200).json({ success: true, message });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.AUTH_TYPES.AuthService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
