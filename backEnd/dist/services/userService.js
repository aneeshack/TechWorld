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
exports.UserService = void 0;
const paymentRepository_1 = require("../repository/paymentRepository");
const inversify_1 = require("inversify");
const types_1 = require("../interfaces/types");
let UserService = class UserService {
    constructor(_userRepository, _paymentRepo = new paymentRepository_1.PaymentRepository()) {
        this._userRepository = _userRepository;
        this._paymentRepo = _paymentRepo;
    }
    getFilteredCourses(searchTerm_1, categoryIds_1, priceMin_1, priceMax_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, categoryIds, priceMin, priceMax, sortOrder = "", page = 1, limit = 10) {
            return this._userRepository.findCourses(searchTerm, categoryIds, priceMin, priceMax, sortOrder, page, limit);
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this._userRepository.getAllCourses();
                if (!courses) {
                    throw new Error('No courses found');
                }
                return courses;
            }
            catch (error) {
                console.error('user service error:get sigle course', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.getSingleCourse(courseId);
            }
            catch (error) {
                console.error('user service error:get sigle course', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this._userRepository.allCategories();
                if (!categories) {
                    throw new Error('No categories found');
                }
                return categories;
            }
            catch (error) {
                console.error('userService error:get all categories', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    initiatePayment(userId, courseId, amount, courseName, courseThumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this._paymentRepo.createCheckoutSession(userId, courseId, amount, courseName, courseThumbnail);
                console.log('sessionid', session.id);
                return { sessionId: session.id };
            }
            catch (error) {
                console.error('user service error:create payment ', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getPaymentStatus(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._paymentRepo.getSession(sessionId);
        });
    }
    courseEnroll(userId, courseId, completionStatus, amount, enrolledAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentData = {
                    userId,
                    courseId,
                    status: 'completed',
                    amount
                };
                const payment = yield this._paymentRepo.paymentCompletion(paymentData);
                if (!payment) {
                    throw new Error("Payment processing failed.");
                }
                const enrollment = yield this._userRepository.enrollUser(userId, courseId, enrolledAt, completionStatus);
                if (!enrollment) {
                    throw new Error("Enrollment failed.");
                }
                return enrollment;
            }
            catch (error) {
                console.error('user service error:enroll course ', error);
                throw new Error(`${error.message}`);
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.USER_TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.USER_TYPES.PaymentRepository)),
    __metadata("design:paramtypes", [Object, paymentRepository_1.PaymentRepository])
], UserService);
