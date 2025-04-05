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
exports.InstructorController = void 0;
const IUser_1 = require("../interfaces/database/IUser");
const s3Service_1 = __importDefault(require("../services/s3Service"));
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
class InstructorController {
    constructor(_instructorService, _s3Service = new s3Service_1.default()) {
        this._instructorService = _instructorService;
        this._s3Service = _s3Service;
    }
    fetchCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this._instructorService.getCategories();
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "fetch all categories",
                    data: categories,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || req.user.role !== IUser_1.Role.Instructor || !req.user.id) {
                    return (0, errorMiddleware_1.throwError)(403, "Forbidden: Only instructors can create courses");
                }
                const { title, description, thumbnail, category, price } = req.body;
                const instructorId = req.user.id;
                if (!title || !description || !thumbnail || !category || !price) {
                    (0, errorMiddleware_1.throwError)(400, "Invalid credentials: All fields are required");
                }
                const courseData = {
                    title,
                    description,
                    thumbnail,
                    instructor: instructorId,
                    category,
                    price,
                };
                const course = yield this._instructorService.createCourse(courseData);
                res
                    .status(200)
                    .json({ success: true, message: "created the course", data: course });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    updateCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const updatedCourse = yield this._instructorService.updateCourse(courseId, req.body);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "updated the course",
                    data: updatedCourse,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    fetchAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res
                        .status(401)
                        .json({ success: false, message: "Unauthorized: No user data" });
                    return;
                }
                if (req.user.role !== IUser_1.Role.Instructor || !req.user.id) {
                    (0, errorMiddleware_1.throwError)(401, "Unauthorized: Only instructors can fetch courses");
                }
                const instructorId = req.user.id;
                const courses = yield this._instructorService.fetchAllCourses(instructorId);
                res
                    .status(200)
                    .json({ success: true, message: "fetch all course", data: courses });
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
                const courseId = req.params.courseId;
                const course = yield this._instructorService.fetchCourse(courseId);
                if (!course) {
                    (0, errorMiddleware_1.throwError)(404, "Course not found");
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
    getPresignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileName, fileType } = req.body;
                if (!fileName || !fileType) {
                    (0, errorMiddleware_1.throwError)(400, "Missing fileName or fileType");
                }
                const { presignedUrl, videoUrl } = yield this._instructorService.getPresignedUrl(fileName, fileType);
                res.json({ presignedUrl, videoUrl });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    addLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || req.user.role !== IUser_1.Role.Instructor || !req.user.id) {
                    res
                        .status(403)
                        .json({
                        success: false,
                        message: "Forbidden: Only instructors can add lesson",
                    });
                    return;
                }
                const { title, description, thumbnail, pdf, video, course } = req.body;
                const instructorId = req.user.id;
                if (!title || !description || !thumbnail || !video || !course) {
                    throw new Error("invalid credentials");
                }
                const lessonData = {
                    title,
                    description,
                    thumbnail,
                    instructor: instructorId,
                    pdf,
                    video,
                    course,
                };
                const lesson = yield this._instructorService.addLesson(lessonData);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "created the lesson",
                    data: { lessonId: lesson === null || lesson === void 0 ? void 0 : lesson._id },
                });
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
    updateLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonId = req.params.lessonId;
                const updatedLesson = yield this._instructorService.updateLesson(lessonId, req.body);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "updated the lesson",
                    data: updatedLesson,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    publishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const publishedCourse = yield this._instructorService.publishCourse(courseId);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "published the course",
                    data: publishedCourse,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    addOrUpdateAssessment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lessonId } = req.params;
                const { questions } = req.body;
                const lesson = yield this._instructorService.addAssessment(lessonId, questions);
                res
                    .status(200)
                    .json({ message: "Assessment saved successfully", lesson });
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error });
            }
        });
    }
    getInstructorProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const instructorProfile = yield this._instructorService.fetchInstructorProfile(userId);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "instructor profile fetched successfully!",
                    data: instructorProfile,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                res.status(400).json({ success: false, message: message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const updateData = req.body;
                const updatedInstructor = yield this._instructorService.updateInstructorProfile(userId, updateData);
                if (!updatedInstructor) {
                    (0, errorMiddleware_1.throwError)(400, "update instructor error");
                }
                res.status(200).json({ success: true, data: updatedInstructor });
            }
            catch (error) {
                console.error("Error in InstructorController.updateProfile:", error);
                res.status(500).json({ success: false, message: "Server error" });
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
                const presignedUrl = yield this._s3Service.generatePresignedUrl(videoKey, 300); // Use S3Service directly
                console.log('presigned url', presignedUrl);
                res.status(200).json({ success: true, presignedUrl });
            }
            catch (error) {
                console.error("Error in InstructorController :get presigned url for video", error);
                res.status(500).json({ success: false, message: "Server error" });
            }
        });
    }
}
exports.InstructorController = InstructorController;
