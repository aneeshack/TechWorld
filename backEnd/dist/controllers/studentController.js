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
exports.StudentController = void 0;
const enrollmentModel_1 = require("../models/enrollmentModel");
const lessonModel_1 = require("../models/lessonModel");
const reviewModel_1 = require("../models/reviewModel");
const s3ServiceInstance_1 = __importDefault(require("../services/s3ServiceInstance"));
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
class StudentController {
    constructor(_studentService, _instructorService, _s3Service = s3ServiceInstance_1.default) {
        this._studentService = _studentService;
        this._instructorService = _instructorService;
        this._s3Service = _s3Service;
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    (0, errorMiddleware_1.throwError)(400, 'Student id is required');
                }
                const student = yield this._studentService.fetchStudentProfile(userId);
                if (!student) {
                    res.status(404).json({ success: false, message: 'Student not found' });
                    return;
                }
                res.status(200).json({ success: true, data: student });
            }
            catch (error) {
                console.error('Error in StudentController.getProfile:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const updateData = req.body;
                const student = yield this._studentService.updateStudentProfile(userId, updateData);
                if (!student) {
                    res.status(404).json({ success: false, message: 'Student not found' });
                    return;
                }
                res.status(200).json({ success: true, data: student });
            }
            catch (error) {
                console.error('Error in StudentController.updateProfile:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        });
    }
    getStudentPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const payments = yield this._studentService.getPaymentsByUserId(userId);
                res.status(200).json({
                    success: true,
                    data: payments,
                    message: "Payments retrieved successfully",
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    ;
    fetchSingleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const course = yield this._instructorService.fetchCourse(courseId);
                if (!course) {
                    res.status(404).json({ success: false, message: "Course not found" });
                    return;
                }
                res
                    .status(200)
                    .json({ success: true, message: "fetch single course", data: course });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    fetchAllLessons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                if (!courseId) {
                    res
                        .status(400)
                        .json({ success: false, message: "invalid credentials" });
                    return;
                }
                const lessons = yield this._instructorService.allLessons(courseId);
                if (!lessons || lessons.length === 0) {
                    res.status(404).json({ success: false, message: "No lessons found" });
                    return;
                }
                res
                    .status(200)
                    .json({ success: true, message: "fetch all lessons", data: lessons });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    presSignedUrlForVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lessonId } = req.params;
                const lesson = yield this._instructorService.fetchLesson(lessonId);
                if (!lesson || !lesson.video) {
                    res.status(404).json({ success: false, message: "Lesson or video not found" });
                    return;
                }
                const videoKey = lesson.video.split(".amazonaws.com/")[1]; // Extract S3 key from URL
                const presignedUrl = yield this._s3Service.generatePresignedUrl(videoKey, 300);
                console.log('presigned url', presignedUrl);
                res.status(200).json({ success: true, presignedUrl });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                console.error("Error in StudentController: get presigned URL for video", error);
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    fetchSingleLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonId = req.params.lessonId;
                const lesson = yield this._instructorService.fetchLesson(lessonId);
                if (!lesson) {
                    res.status(404).json({ success: false, message: "lesson not found" });
                    return;
                }
                res
                    .status(200)
                    .json({ success: true, message: "fetch single lesson", data: lesson });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    // async submitAssessment(req: AuthRequest, res: Response):Promise<void> {
    //   try {
    //     const { lessonId, score } = req.body;
    //     const userId = req.user?.id; 
    //     res.status(200).json({ message: "Assessment submitted successfully", score });
    //   } catch (error) {
    //     res.status(500).json({ message: "Error submitting assessment", error });
    //   }
    // };
    updateLessonProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId, lessonId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!courseId || !lessonId) {
                    res.status(400).json({ message: "Invalid request data." });
                    return;
                }
                const enrollment = yield enrollmentModel_1.enrollmentModel.findOne({ userId, courseId });
                if (!enrollment) {
                    res.status(404).json({ message: "Enrollment not found." });
                    return;
                }
                // Add lesson ID to completed lessons if not already there
                if (!enrollment.progress.completedLessons.includes(lessonId)) {
                    enrollment.progress.completedLessons.push(lessonId);
                    // Calculate completion percentage
                    const totalLessons = yield lessonModel_1.lessonModel.countDocuments({ course: courseId });
                    enrollment.progress.overallCompletionPercentage = Math.round((enrollment.progress.completedLessons.length / totalLessons) * 100);
                    // Update completion status
                    if (enrollment.progress.overallCompletionPercentage >= 100) {
                        enrollment.completionStatus = "completed";
                    }
                    else {
                        enrollment.completionStatus = "in-progress";
                    }
                    yield enrollment.save();
                }
                res.status(200).json({ message: "Lesson progress updated successfully." });
            }
            catch (error) {
                console.error("Error updating progress:", error);
                res.status(500).json({ message: "Internal server error." });
            }
        });
    }
    ;
    fetchEnrolledCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res.status(400).json({ success: false, message: "User ID is required" });
                    return;
                }
                const enrolledCourses = yield this._studentService.getEnrolledCourses(userId);
                res.status(200).json({ success: true, message: "Fetched enrolled courses", data: enrolledCourses });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getEnrollment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(400).json({ success: false, message: "User ID is required" });
                    return;
                }
                if (!courseId) {
                    res.status(400).json({ success: false, message: "course ID is required" });
                    return;
                }
                const enrollment = yield this._studentService.getEnrollment(userId.toString(), courseId);
                res.status(200).json({ success: true, message: "Fetched enrollment of courses", data: enrollment });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { rating, review } = req.body;
                if (!userId) {
                    res.status(400).json({ success: false, message: "User ID is required" });
                    return;
                }
                if (!courseId) {
                    res.status(400).json({ success: false, message: "course ID is required" });
                    return;
                }
                const courseReview = yield this._studentService.addReview(userId.toString(), courseId, rating, review);
                res.status(200).json({ success: true, message: "add review to a courses", data: courseReview });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    getStudentReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!studentId) {
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                const review = yield reviewModel_1.reviewModel.findOne({ studentId, courseId });
                if (!review) {
                    res.status(404).json({ success: false, message: "No review found" });
                    return;
                }
                res.status(200).json({ success: true, data: review });
            }
            catch (error) {
                console.error("Error fetching review:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.StudentController = StudentController;
