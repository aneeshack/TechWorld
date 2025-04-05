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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const IUser_1 = require("../interfaces/database/IUser");
const generateOtp_1 = require("../util/auth/generateOtp");
const jwt_1 = require("../util/auth/jwt");
const nodeMailer_1 = __importDefault(require("../util/auth/nodeMailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../interfaces/types");
let AuthService = class AuthService {
    // constructor(private _authRepository: IAuthRepository){}
    constructor(_authRepository) {
        this._authRepository = _authRepository;
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userData.email || !userData.password) {
                    throw new Error('Email and password is required');
                }
                const existingUser = yield this._authRepository.findByEmail(userData.email);
                if (existingUser) {
                    throw new Error('User already exists');
                }
                userData.password = yield bcrypt_1.default.hash(userData.password, 10);
                yield this._authRepository.createUser(Object.assign(Object.assign({}, userData), { isOtpVerified: false }));
                // generate and save otp
                const otp = generateOtp_1.OtpGenerator.generateOtp();
                console.log('otp', otp);
                yield this._authRepository.createOtp({ email: userData.email, otp });
                const emailService = new nodeMailer_1.default();
                yield emailService.sendMail(userData.email, "otp verification", otp);
                return { message: "Signup successful. Please verify your email." };
            }
            catch (error) {
                console.error('authService error:signup', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._authRepository.findById(userId);
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundOtp = yield this._authRepository.findOtpByEmail(email);
                if (!foundOtp) {
                    throw new Error('Otp expired');
                }
                if (foundOtp.otp !== otp) {
                    throw new Error('Invalid Otp');
                }
                const user = yield this._authRepository.updateUser(email, { isOtpVerified: true });
                if (!user) {
                    throw new Error('Failed to update user');
                }
                const token = yield (0, jwt_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user._id, email, role: user === null || user === void 0 ? void 0 : user.role });
                yield this._authRepository.deleteOtp(email);
                return { message: 'user signup successfull', token, user };
            }
            catch (error) {
                console.error('authService error:verify Otp', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authRepository.findByEmail(email);
                if (!user) {
                    throw new Error('user not found');
                }
                yield this._authRepository.deleteOtp(email);
                // generate and save otp
                const otp = generateOtp_1.OtpGenerator.generateOtp();
                console.log('otp', otp);
                yield this._authRepository.createOtp({ email, otp });
                const emailService = new nodeMailer_1.default();
                yield emailService.sendMail(email, "otp verification", otp);
                return { message: "Signup successful. Please verify your email." };
            }
            catch (error) {
                console.error('authService error:resend Otp', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    loginAction(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userData.email || !userData.password) {
                    throw new Error('Email is required');
                }
                const user = yield this._authRepository.verifyUser(userData.email, userData === null || userData === void 0 ? void 0 : userData.password);
                if (!user) {
                    throw new Error('Invalid credentials');
                }
                if (userData.role !== user.role) {
                    throw new Error('Invalid credentials');
                }
                const token = yield (0, jwt_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, role: user === null || user === void 0 ? void 0 : user.role });
                return { message: "Login successful.", user: user, token };
            }
            catch (error) {
                console.error('authService error:login', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authRepository.updateRegister(userData);
                if (!user) {
                    throw new Error('can not find user');
                }
                return { message: 'success', user };
            }
            catch (error) {
                console.error('authService error:signup', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    googleAuth(credentials, roleInput) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!credentials || !credentials.credential) {
                    throw new Error("No credentials received.");
                }
                // Decode the JWT token
                const decoded = jsonwebtoken_1.default.decode(credentials.credential);
                if (!decoded || typeof decoded !== 'object') {
                    throw new Error("Invalid token. Decoding failed.");
                }
                // Extract values from the decoded token
                const { email, name, picture, sub: googleId } = decoded;
                console.log("Decoded Token -> Name:", name, "Email:", email, "Google ID:", googleId);
                if (!googleId) {
                    throw new Error("Google ID (sub) is missing in credentials.");
                }
                let user = yield this._authRepository.findByEmail(email);
                if (user && (user === null || user === void 0 ? void 0 : user.role) !== roleInput) {
                    throw new Error(`you signed in as ${user === null || user === void 0 ? void 0 : user.role}. Please use the ${user === null || user === void 0 ? void 0 : user.role} login page`);
                }
                if (!user) {
                    user = yield this._authRepository.createUser({
                        email,
                        userName: name,
                        isGoogleAuth: true,
                        role: roleInput,
                        isOtpVerified: false,
                        profile: {
                            avatar: picture
                        }
                    });
                }
                else {
                    const updateData = {};
                    if (!user.isGoogleAuth) {
                        updateData.isGoogleAuth = true;
                    }
                    if (!((_a = user.profile) === null || _a === void 0 ? void 0 : _a.avatar)) {
                        updateData.profile = Object.assign(Object.assign({}, (user.profile || {})), { avatar: picture });
                    }
                    if (!user.userName) {
                        updateData.userName = name;
                    }
                    if (Object.keys(updateData).length > 0) {
                        user = yield this._authRepository.updateUser(email, updateData);
                    }
                }
                if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                    throw new Error('admin blocked you. Please contact admin.');
                }
                const token = yield (0, jwt_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user._id, email, role: user === null || user === void 0 ? void 0 : user.role });
                return { message: "google authentication successful.", user: user !== null && user !== void 0 ? user : undefined, token };
            }
            catch (error) {
                console.error('authService error:google signup', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    forgotPassword(email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authRepository.findByEmail(email);
                if (!user) {
                    throw new Error('User not found. Please signup again');
                }
                if (user.role === IUser_1.Role.Admin || user.role !== role) {
                    throw new Error('Unauthorized access');
                }
                if (user.isGoogleAuth) {
                    throw new Error('Please login through google or signup');
                }
                yield this._authRepository.deleteOtp(email);
                // generate and save otp
                const otp = generateOtp_1.OtpGenerator.generateOtp();
                console.log('otp', otp);
                yield this._authRepository.createOtp({ email, otp });
                const emailService = new nodeMailer_1.default();
                yield emailService.sendMail(email, "otp verification", otp);
                return { message: "Signup successful. Please verify your email." };
            }
            catch (error) {
                console.error('authService error:forgot password', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    resetPassword(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authRepository.findByEmail(email);
                if (!user) {
                    throw new Error("User not found");
                }
                if (user.role !== role) {
                    throw new Error('role is not matching');
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Hashing password
                yield this._authRepository.updatePassword(user === null || user === void 0 ? void 0 : user._id, hashedPassword);
                return { message: 'password reset successfully' };
            }
            catch (error) {
                console.error('authService error:reset password', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    verifyForgotPasswordOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundOtp = yield this._authRepository.findOtpByEmail(email);
                if (!foundOtp) {
                    throw new Error('OTP expired or not found');
                }
                if (foundOtp.otp !== otp) {
                    throw new Error('Invalid OTP');
                }
                // No need to update user here; we'll handle reset in the next step
                yield this._authRepository.deleteOtp(email);
                return { message: 'OTP verified for password reset' };
            }
            catch (error) {
                console.error('authService error: verifyForgotPasswordOtp', error);
                throw new Error(`${error.message}`);
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.AUTH_TYPES.AuthRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
