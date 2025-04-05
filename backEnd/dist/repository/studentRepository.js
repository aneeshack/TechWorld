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
exports.StudentRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const paymentModel_1 = require("../models/paymentModel");
const enrollmentModel_1 = require("../models/enrollmentModel");
const reviewModel_1 = require("../models/reviewModel");
const courseModel_1 = require("../models/courseModel");
class StudentRepository {
    getStudentProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findById(userId);
            }
            catch (error) {
                console.error("Error fetching student profile:", error);
                throw new Error("Failed to fetch student profile");
            }
        });
    }
    updateStudent(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return userModel_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userId), role: 'student' }, { $set: updateData }, { new: true } // Return the updated document
                ).exec();
            }
            catch (error) {
                console.error("Error updating student profile:", error);
                throw new Error("Failed to update student profile");
            }
        });
    }
    fetchPayment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield paymentModel_1.paymentModel
                    .find({ userId })
                    .populate('courseId', 'title');
                return payments;
            }
            catch (error) {
                console.error("Error updating student profile:", error);
                throw new Error("Failed to update student profile");
            }
        });
    }
    enrolledCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield enrollmentModel_1.enrollmentModel.aggregate([
                    { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
                    {
                        $lookup: {
                            from: 'courses',
                            localField: 'courseId',
                            foreignField: '_id',
                            as: 'courseDetails'
                        }
                    },
                    {
                        $unwind: '$courseDetails'
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'courseDetails.category',
                            foreignField: '_id',
                            as: 'courseDetails.category'
                        }
                    },
                    {
                        $unwind: '$courseDetails.category'
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'courseDetails.instructor',
                            foreignField: '_id',
                            as: 'courseDetails.instructor'
                        }
                    },
                    {
                        $unwind: '$courseDetails.instructor'
                    },
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            courseId: 1,
                            enrolledAt: 1,
                            completionStatus: 1,
                            progress: 1,
                            'courseDetails.title': 1,
                            "courseDetails.description": 1,
                            "courseDetails.thumbnail": 1,
                            "courseDetails.category": 1,
                            "courseDetails.lessonCount": 1,
                            "courseDetails.instructor._id": 1,
                            "courseDetails.instructor.userName": 1,
                            "courseDetails.instructor.profile.avatar": 1,
                        }
                    }
                ]);
                return enrolledCourses;
            }
            catch (error) {
                console.error("user Repository error: enrolled courses", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    studentCourseEnrollment(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollment = yield enrollmentModel_1.enrollmentModel
                    .findOne({ userId, courseId })
                    .populate("courseId")
                    .populate("progress.completedLessons");
                return enrollment;
            }
            catch (error) {
                console.error("Error fetch student course enrollment:", error);
                throw new Error("Failed to fetch student course enrollment");
            }
        });
    }
    getReview(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(studentId) || !mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                    throw new Error("Invalid studentId or courseId");
                }
                return yield reviewModel_1.reviewModel.findOne({ studentId, courseId }).exec();
            }
            catch (error) {
                console.error("Error in getting the review:", error);
                throw new Error("rror in getting the review:");
            }
        });
    }
    // Helper function to update course rating
    updateCourseRating(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratingStats = yield reviewModel_1.reviewModel.aggregate([
                { $match: { courseId: new mongoose_1.default.Types.ObjectId(courseId) } },
                {
                    $group: {
                        _id: "$courseId",
                        averageRating: { $avg: "$rating" }, // Calculate average
                    },
                },
            ]);
            const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;
            yield courseModel_1.courseModel.updateOne({ _id: courseId }, { $set: { rating: Number(averageRating.toFixed(1)) } } // Store as a number with 1 decimal
            );
        });
    }
    createReview(studentId, courseId, rating, reviewText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(studentId) || !mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                    throw new Error("Invalid studentId or courseId");
                }
                const newReview = yield reviewModel_1.reviewModel.create({
                    studentId,
                    courseId,
                    rating,
                    reviewText,
                });
                yield this.updateCourseRating(courseId);
                return newReview;
            }
            catch (error) {
                console.error("Error create the review:", error);
                throw new Error("Failed create course review");
            }
        });
    }
    updateReview(studentId, courseId, rating, reviewText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(studentId) || !mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                    throw new Error("Invalid studentId or courseId");
                }
                const updatedReview = yield reviewModel_1.reviewModel.findOneAndUpdate({ studentId, courseId }, { rating, reviewText }, { new: true, runValidators: true } // Returns updated document, applies schema validation
                );
                if (!updatedReview) {
                    throw new Error("Review not found for update");
                }
                yield this.updateCourseRating(courseId);
                return updatedReview;
            }
            catch (error) {
                console.error("Error update the review:", error);
                throw new Error("Failed student course review");
            }
        });
    }
}
exports.StudentRepository = StudentRepository;
