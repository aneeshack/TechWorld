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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const paymentModel_1 = require("../models/paymentModel");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    instructorRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allRequsts = yield this._adminService.getAllRequsts();
                res.status(201).json({ success: true, data: allRequsts });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    rejectedInstructors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allRequsts = yield this._adminService.getAllRejectedRequests();
                res.status(201).json({ success: true, data: allRequsts });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    approveInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const updatedUser = yield this._adminService.approveRequest(userId);
                res.status(201).json({ success: true, message: "Instructor approved", updatedUser });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    rejectInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const updatedUser = yield this._adminService.rejecteRequest(userId);
                res.status(201).json({ success: true, message: "Instructor rejected", updatedUser });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this._adminService.getAllUsers();
                res.status(200).json({ success: true, data: allUsers });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const blockedUser = yield this._adminService.blockUser(userId);
                res.status(201).json({ success: true, message: "user is blocked", blockedUser });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    unBlockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const unblockedUser = yield this._adminService.unBlockUser(userId);
                res.status(201).json({ success: true, message: "user is unblocked", unblockedUser });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getPresignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileName, fileType } = req.body;
                const { presignedUrl, imageUrl } = yield this._adminService.getPresignedUrl(fileName, fileType);
                res.json({ presignedUrl, imageUrl });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName, description, imageUrl } = req.body;
                if (!categoryName || !description || !imageUrl) {
                    (0, errorMiddleware_1.throwError)(400, "All fields are required.");
                }
                const newCategory = yield this._adminService.createCategory(categoryName, description, imageUrl);
                if (!newCategory) {
                    (0, errorMiddleware_1.throwError)(500, "Error in creating new category.");
                }
                res.status(201).json({ success: true, message: 'Category added successfully', newCategory });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCategories = yield this._adminService.getAllCategories();
                res.status(201).json({ success: true, data: allCategories });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getSingleCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.categoryId;
                const category = yield this._adminService.getCategoryById(categoryId);
                res.status(200).json({ success: true, data: category });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.categoryId;
                if (!categoryId) {
                    (0, errorMiddleware_1.throwError)(400, "All fields are required.");
                }
                const { categoryName, description, imageUrl } = req.body;
                const updateCategory = yield this._adminService.updateCategory(categoryId, {
                    categoryName,
                    description,
                    imageUrl
                });
                res.status(200).json({ success: true, data: updateCategory });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    fetchPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield paymentModel_1.paymentModel
                    .find()
                    .populate("userId", " userName email") // Populating user details
                    .populate("courseId", "title price") // Populating course details
                    .sort({ createdAt: -1 }); // Sorting by most recent transactions
                res.json({ payments });
            }
            catch (error) {
                console.error("Error fetching payments:", error);
                res.status(500).json({ message: "Failed to fetch payments" });
            }
        });
    }
    getPresignedUrlForImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                if (!categoryId) {
                    (0, errorMiddleware_1.throwError)(400, 'Category id not found');
                }
                const presignedUrl = yield this._adminService.getPresignedUrlForCategoryImage(categoryId);
                res.json({ presignedUrl });
            }
            catch (error) {
                console.error("Error in InstructorController :get presigned url for video", error);
                res.status(500).json({ success: false, message: "Server error" });
            }
        });
    }
}
exports.AdminController = AdminController;
