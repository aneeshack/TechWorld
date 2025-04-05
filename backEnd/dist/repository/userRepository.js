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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const courseModel_1 = require("../models/courseModel");
const enrollmentModel_1 = require("../models/enrollmentModel");
const categoryModel_1 = require("../models/categoryModel");
const inversify_1 = require("inversify");
let UserRepository = class UserRepository {
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseModel_1.courseModel.find({ isPublished: true })
                    .populate("category", "categoryName")
                    .populate('instructor', 'userName')
                    .exec();
                if (!courses) {
                    throw new Error('Courses not found');
                }
                return courses;
            }
            catch (error) {
                console.error("user Repository error:get all courses", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    findCourses() {
        return __awaiter(this, arguments, void 0, function* (searchTerm = "", categoryIds = [], priceMin, priceMax, sortOrder = "", page = 1, limit = 10) {
            const query = { isPublished: true };
            if (searchTerm) {
                query.title = { $regex: searchTerm, $options: "i" };
            }
            if (categoryIds.length > 0) {
                query.category = { $in: categoryIds };
            }
            if (priceMin !== undefined || priceMax !== undefined) {
                query.price = {};
                if (priceMin !== undefined)
                    query.price.$gte = priceMin;
                if (priceMax !== undefined)
                    query.price.$lte = priceMax;
            }
            const sort = {};
            if (sortOrder === "asc" || sortOrder === "desc") {
                sort.price = sortOrder === "asc" ? 1 : -1;
            }
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;
            // Execute query with pagination
            const courses = yield courseModel_1.courseModel
                .find(query)
                .populate("category", "categoryName")
                .populate("instructor", "userName")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec();
            // Get total count of matching documents
            const total = yield courseModel_1.courseModel.countDocuments(query);
            return { courses, total };
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findOne({ _id: courseId, isPublished: true })
                    .populate("category", "categoryName")
                    .populate("instructor", "userName")
                    .populate({
                    path: 'lessons',
                    select: 'lessonNumber title thumbnail description ',
                    options: { sort: { lessonNumber: 1 } }
                })
                    .exec();
                return course;
            }
            catch (error) {
                console.error("user Repository error:get single course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    allCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryModel_1.Category.find({ isActive: true });
                return categories;
            }
            catch (error) {
                console.error("user Repository error:getAll categories", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    enrollUser(userId, courseId, enrolledAt, completionStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolled = new enrollmentModel_1.enrollmentModel({ userId, courseId, enrolledAt, completionStatus });
                yield enrolled.save();
                return enrolled;
            }
            catch (error) {
                console.error("user Repository error: enroll course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
