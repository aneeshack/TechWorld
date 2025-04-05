"use strict";
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
exports.AdminRepository = void 0;
const IUser_1 = require("../interfaces/database/IUser");
const categoryModel_1 = require("../models/categoryModel");
const userModel_1 = __importDefault(require("../models/userModel"));
const genericRepository_1 = require("./genericRepository");
class AdminRepository {
    constructor() {
        this._userRepository = new genericRepository_1.GenericRepository(userModel_1.default);
        this._categoryRepository = new genericRepository_1.GenericRepository(categoryModel_1.Category);
    }
    getAllRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.findAll({
                    role: "instructor",
                    isRequested: true,
                    requestStatus: "pending",
                });
            }
            catch (error) {
                console.error("adminRepository error:getAllRequest", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getAllRejectedRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.findAll({
                    role: "instructor",
                    isRequested: true,
                    requestStatus: IUser_1.RequestStatus.Rejected,
                });
            }
            catch (error) {
                console.error("adminRepository error:getAllRejectedRequests", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    approveRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.update(userId, {
                    requestStatus: IUser_1.RequestStatus.Approved,
                });
            }
            catch (error) {
                console.error("adminRepository error:approveRequest", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    rejectRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.update(userId, {
                    requestStatus: IUser_1.RequestStatus.Rejected,
                });
            }
            catch (error) {
                console.error("adminRepository error:rejectRequest", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this._userRepository.findAll({
                    role: { $in: ["instructor", "student"] },
                    $or: [{ isGoogleAuth: true }, { isOtpVerified: true }],
                });
                return users;
            }
            catch (error) {
                console.error("adminRepository error:getAllUsers", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.update(userId, { isBlocked: true });
            }
            catch (error) {
                console.error("adminRepository error:blockUser", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.update(userId, { isBlocked: false });
            }
            catch (error) {
                console.error("adminRepository error:unblockUser", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    createCategory(categoryName, description, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryRepository.create({ categoryName, description, imageUrl });
            }
            catch (error) {
                console.error("adminRepository error:createCategory", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    allCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryRepository.findAll({ isActive: true });
            }
            catch (error) {
                console.error("adminRepository error:allCategories", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this._categoryRepository.findById(categoryId));
            }
            catch (error) {
                console.error("adminRepository error:getCategoryById", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    updateCategory(categoryId, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this._categoryRepository.update(categoryId, categoryData));
            }
            catch (error) {
                console.error("adminRepository error:updateCategory", error);
                throw new Error(`${error.message}`);
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
