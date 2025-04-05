"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthRepository = void 0;
const inversify_1 = require("inversify");
const IUser_1 = require("../interfaces/database/IUser");
const otpModel_1 = __importDefault(require("../models/otpModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthRepository = class AuthRepository {
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById(userId);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOne({ email });
            }
            catch (error) {
                console.error("authRepository error:finbyemail", error);
                throw new Error(`Error in finding Email: ${error.message}`);
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new userModel_1.default(userData);
                return yield user.save();
            }
            catch (error) {
                console.error("authRepository error:createUser", error);
                throw new Error(`Error in creating user: ${error.message}`);
            }
        });
    }
    updateUser(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
                if (!user) {
                    throw new Error("User update failed. No user found.");
                }
                return user;
            }
            catch (error) {
                console.error("authRepository error:updateUser", error);
                throw new Error(`Error in updating user: ${error.message}`);
            }
        });
    }
    createOtp(otpData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = new otpModel_1.default(otpData);
                yield otp.save();
            }
            catch (error) {
                console.error("authRepository error:create otp", error);
                throw new Error(`Error in creating otp: ${error.message}`);
            }
        });
    }
    findOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield otpModel_1.default.findOne({ email });
            }
            catch (error) {
                console.error("authRepository error: find otp by email", error);
                throw new Error(`Error in finding otp by email: ${error.message}`);
            }
        });
    }
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield otpModel_1.default.deleteOne({ email });
            }
            catch (error) {
                console.error("authRepository error: delete otp", error);
                throw new Error(`Error in deleting otp: ${error.message}`);
            }
        });
    }
    verifyUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error("user not found");
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }
                if (!user.isOtpVerified) {
                    throw new Error("OTP not verified. Signup again");
                }
                return user;
            }
            catch (error) {
                console.error("authRepository error: verify user", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    updateRegister(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateInstructor = yield userModel_1.default.findByIdAndUpdate(userData._id, { $set: userData, isRequested: true, requestStatus: IUser_1.RequestStatus.Pending }, { new: true });
                if (!updateInstructor) {
                    throw new Error('Failed to update instructor');
                }
                const user = yield userModel_1.default.findById(userData._id);
                return user;
            }
            catch (error) {
                console.error("authRepository error: register instructor", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    updatePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.default.updateOne({ _id: userId }, { $set: { password } });
            }
            catch (error) {
                console.error("authRepository error: reset password", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, inversify_1.injectable)()
], AuthRepository);
// import { Model } from "mongoose";
// import bcrypt from "bcrypt";
// import mongoose from "mongoose";
// import { IAuthRepository } from "../interfaces/user/IAuthRepository";
// import { IUser, RequestStatus } from "../interfaces/database/IUser";
// import { GenericRepository } from "./genericRepository";
// import UserModel from "../models/userModel";
// import OtpModel, { IOtp } from "../models/otpModel";
// export class AuthRepository implements IAuthRepository {
//   private _userRepository: GenericRepository<IUser>;
//   private _otpRepository: GenericRepository<IOtp>;
//   constructor(
//     userModel: Model<IUser> = UserModel,
//     otpModel: Model<IOtp> = OtpModel  ) {
//     this._userRepository = new GenericRepository<IUser>(userModel);
//     this._otpRepository = new GenericRepository<IOtp>(otpModel);
//   }
//   async findById(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
//     try {
//       return await this._userRepository.findById(userId.toString());
//     } catch (error) {
//       console.log("authRepository error: findById", error);
//       throw new Error(`Error finding user by ID: ${(error as Error).message}`);
//     }
//   }
//   async findByEmail(email: string): Promise<IUser | null> {
//     try {
//       return await this._userRepository.findOne({ email });
//     } catch (error) {
//       console.log("authRepository error: findByEmail", error);
//       throw new Error(`Error finding email: ${(error as Error).message}`);
//     }
//   }
//   async createUser(userData: Partial<IUser>): Promise<IUser> {
//     try {
//       return await this._userRepository.create(userData);
//     } catch (error) {
//       console.log("authRepository error: createUser", error);
//       throw new Error(`Error creating user: ${(error as Error).message}`);
//     }
//   }
//   async updateUser(email: string, updateData: Partial<IUser>): Promise<IUser | null> {
//     try {
//       const user = await UserModel.findOneAndUpdate(
//         { email },
//         { $set: updateData },
//         { new: true }
//       );
//       if (!user) {
//         throw new Error("User update failed. No user found.");
//       }
//       console.log("user in repository", user);
//       return user;
//     } catch (error) {
//       console.log("authRepository error: updateUser", error);
//       throw new Error(`Error updating user: ${(error as Error).message}`);
//     }
//   }
//   async createOtp(otpData: { email: string; otp: string }): Promise<void> {
//     try {
//       await this._otpRepository.create(otpData);
//     } catch (error) {
//       console.log("authRepository error: createOtp", error);
//       throw new Error(`Error creating OTP: ${(error as Error).message}`);
//     }
//   }
//   async findOtpByEmail(email: string): Promise<{ email: string; otp: string } | null> {
//     try {
//       return await this._otpRepository.findOne({ email });
//     } catch (error) {
//       console.log("authRepository error: findOtpByEmail", error);
//       throw new Error(`Error finding OTP by email: ${(error as Error).message}`);
//     }
//   }
//   async deleteOtp(email: string): Promise<void> {
//     try {
//       await OtpModel.deleteOne({ email }); // Raw Mongoose since GenericRepository lacks delete
//     } catch (error) {
//       console.log("authRepository error: deleteOtp", error);
//       throw new Error(`Error deleting OTP: ${(error as Error).message}`);
//     }
//   }
//   async verifyUser(email: string, password: string): Promise<IUser> {
//     try {
//       const user = await this._userRepository.findOne({ email });
//       if (!user) {
//         throw new Error("User not found");
//       }
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         throw new Error("Invalid credentials");
//       }
//       if (!user.isOtpVerified) {
//         throw new Error("OTP not verified. Signup again");
//       }
//       return user;
//     } catch (error) {
//       console.log("authRepository error: verifyUser", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }
//   async updateRegister(userData: Partial<IUser>): Promise<IUser | null> {
//     try {
//       const updateInstructor = await this._userRepository.update(userData._id as string, {
//         ...userData,
//         isRequested: true,
//         requestStatus: RequestStatus.Pending,
//       });
//       if (!updateInstructor) {
//         throw new Error("Failed to update instructor");
//       }
//       console.log("register", updateInstructor);
//       return updateInstructor;
//     } catch (error) {
//       console.log("authRepository error: updateRegister", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }
//   async updatePassword(userId: string, password: string): Promise<void> {
//     try {
//       await this._userRepository.update(userId, { password });
//     } catch (error) {
//       console.log("authRepository error: updatePassword", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }
// }
