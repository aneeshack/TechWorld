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
exports.UserController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewModel_1 = require("../models/reviewModel");
const paymentModel_1 = require("../models/paymentModel");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const inversify_1 = require("inversify");
const types_1 = require("../interfaces/types");
let UserController = class UserController {
    // constructor(private _userService: IUserService){};
    constructor(_userService) {
        this._userService = _userService;
    }
    ;
    getFilteredCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchTerm, categories, priceMin, priceMax, sortOrder, page, limit } = req.query;
                console.log('req.queries', req.query);
                const validSortOrder = (order) => {
                    if (typeof order !== "string")
                        return "";
                    if (order === "" || order === "asc" || order === "desc")
                        return order;
                    return "";
                };
                let categoryIds = [];
                if (categories) {
                    if (typeof categories === "string") {
                        categoryIds = categories.split(",").map(id => id.trim());
                    }
                    else if (Array.isArray(categories)) {
                        categoryIds = categories.map(id => String(id).trim());
                    }
                }
                categoryIds = categoryIds.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
                const parsedPriceMin = priceMin ? parseInt(priceMin) : undefined;
                const parsedPriceMax = priceMax ? parseInt(priceMax) : undefined;
                const parsedPage = page ? parseInt(page) : 1; // Default to page 1
                const parsedLimit = limit ? parseInt(limit) : 10; // Default to 10 items per page
                const filters = {
                    searchTerm: searchTerm || "",
                    categoryIds,
                    priceMin: parsedPriceMin !== undefined && !isNaN(parsedPriceMin) ? parsedPriceMin : undefined,
                    priceMax: parsedPriceMax !== undefined && !isNaN(parsedPriceMax) ? parsedPriceMax : undefined,
                    sortOrder: validSortOrder(sortOrder),
                    page: parsedPage,
                    limit: parsedLimit,
                };
                const result = yield this._userService.getFilteredCourses(filters.searchTerm, filters.categoryIds, filters.priceMin, filters.priceMax, filters.sortOrder, filters.page, filters.limit);
                res.status(200).json({
                    success: true,
                    data: result.courses,
                    total: result.total,
                    page: parsedPage,
                    limit: parsedLimit,
                    totalPages: Math.ceil(result.total / parsedLimit),
                });
            }
            catch (error) {
                console.error("Error fetching filtered courses:", error);
                res.status(500).json({ success: false, message: "Server error" });
            }
        });
    }
    getAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this._userService.getAllCourses();
                if (!courses) {
                    (0, errorMiddleware_1.throwError)(400, 'no course found');
                }
                res.status(200).json({ success: true, message: "Fetched courses", data: courses });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    fetchSingleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield this._userService.getSingleCourse(courseId);
                if (!course) {
                    (0, errorMiddleware_1.throwError)(400, 'no course found');
                }
                res.status(200).json({ success: true, message: "Fetched course", data: course });
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
                const allCategories = yield this._userService.getAllCategories();
                res.status(201).json({ success: true, data: allCategories });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getCourseReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const reviews = yield reviewModel_1.reviewModel.find({ courseId })
                    .populate('studentId', 'userName')
                    .lean();
                res.status(201).json({ success: true, data: reviews });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    createPaymentSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, courseId, amount, courseName, courseThumbnail } = req.body;
                if (!userId || !courseId || !amount || !courseName || !courseThumbnail) {
                    res.status(400).json({ success: false, message: "Missing required fields" });
                    return;
                }
                // Quick check before proceeding
                const existingPayment = yield paymentModel_1.paymentModel.findOne({ userId, courseId });
                if (existingPayment) {
                    res.status(400).json({
                        success: false,
                        message: "You have already purchased this course"
                    });
                    return;
                }
                const session = yield this._userService.initiatePayment(userId, courseId, amount, courseName, courseThumbnail);
                res.json({ success: true, message: 'session created', data: session });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    ;
    getPaymentSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.params;
                if (!sessionId) {
                    res.status(400).json({ success: false, message: "Session ID required" });
                    return;
                }
                const session = yield this._userService.getPaymentStatus(sessionId);
                res.json({ success: true, data: session });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    courseEnrollment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, courseId, sessionId, completionStatus, amount, enrolledAt } = req.body;
                if (!userId || !courseId || !sessionId || !completionStatus || !amount || !enrolledAt) {
                    res.status(400).json({ success: false, message: "Missing required fields." });
                    return;
                }
                const enrollment = yield this._userService.courseEnroll(userId, courseId, completionStatus, amount, enrolledAt);
                if (!enrollment) {
                    res.status(500).json({ success: false, message: "Enrollment failed." });
                    return;
                }
                res.status(201).json({ success: true, message: "Enrollment successful.", enrollment });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                console.error("Enrollment error:", error);
                res.status(400).json({ success: false, message: message });
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.USER_TYPES.UserService)),
    __metadata("design:paramtypes", [Object])
], UserController);
