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
exports.InstructorRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categoryModel_1 = require("../models/categoryModel");
const courseModel_1 = require("../models/courseModel");
const lessonModel_1 = require("../models/lessonModel");
const userModel_1 = __importDefault(require("../models/userModel"));
class InstructorRepository {
    fetchCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield categoryModel_1.Category.find();
            }
            catch (error) {
                console.log("instructor repository error:fetch all categories", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    addCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCourse = new courseModel_1.courseModel(courseData);
                return yield newCourse.save();
            }
            catch (error) {
                console.log("instructor repository error:add course", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    editCourse(courseId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = courseModel_1.courseModel.findByIdAndUpdate(courseId, updateData, { new: true });
                if (!course) {
                    throw new Error('course does not exist');
                }
                return course;
            }
            catch (error) {
                console.log("instructor repository error:edit course", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    getAllCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseModel_1.courseModel.aggregate([
                    // Match courses by instructor
                    { $match: { instructor: instructorId } },
                    // Lookup category details
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category",
                            foreignField: "_id",
                            as: "category",
                        },
                    },
                    { $unwind: "$category" },
                    // Lookup lessons
                    {
                        $lookup: {
                            from: "lessons",
                            localField: "lessons",
                            foreignField: "_id",
                            as: "lessons",
                        },
                    },
                    // Add lesson count
                    {
                        $addFields: {
                            lessonCount: { $size: "$lessons" },
                        },
                    },
                    // Lookup enrollment count
                    {
                        $lookup: {
                            from: "enrollments",
                            let: { courseId: "$_id" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                                { $count: "studentsCount" },
                            ],
                            as: "enrollmentData",
                        },
                    },
                    // Unwind enrollmentData (preserve courses with no enrollments)
                    {
                        $unwind: {
                            path: "$enrollmentData",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    // First $project: Exclude unwanted fields
                    {
                        $project: {
                            lessons: 0, // Exclude lessons array
                        },
                    },
                    // Second $project: Add computed studentsCount
                    {
                        $project: {
                            title: 1,
                            category: 1,
                            price: 1,
                            thumbnail: 1,
                            lessonCount: 1,
                            instructor: 1,
                            isPublished: 1,
                            studentsCount: { $ifNull: ["$enrollmentData.studentsCount", 0] },
                        },
                    },
                ]);
                console.log("courses with student count", courses);
                return courses;
            }
            catch (error) {
                console.log("instructor repository error: get all courses", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(courseId).populate('instructor', 'userName');
                if (!course) {
                    throw new Error('No course found');
                }
                console.log('course instu repo', course);
                return course;
            }
            catch (error) {
                console.log("instructor repository error:get single course", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    courseLessons(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield lessonModel_1.lessonModel.find({ course: courseId }).exec();
            }
            catch (error) {
                console.log("instructor repository error:get all lessons", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    addLesson(lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newLesson = new lessonModel_1.lessonModel(lessonData);
                const savedLesson = yield newLesson.save();
                yield courseModel_1.courseModel.findByIdAndUpdate(lessonData.course, { $push: { lessons: savedLesson._id } }, { new: true });
                return savedLesson;
            }
            catch (error) {
                console.log("instructor repository error:add lesson", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    getSingleLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield lessonModel_1.lessonModel.findById(lessonId);
                if (!lesson) {
                    throw new Error('No lesson found');
                }
                return lesson;
            }
            catch (error) {
                console.log("instructor repository error:get single lesson", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    editLesson(lessonId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield lessonModel_1.lessonModel.findByIdAndUpdate(lessonId, updatedData, { new: true });
            }
            catch (error) {
                console.log("instructor repository error:edit lesson", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    addAssessment(lessonId, assessmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield lessonModel_1.lessonModel.findByIdAndUpdate(lessonId, { assessment: assessmentData }, { new: true });
            }
            catch (error) {
                console.log("instructor repository error:add assessment", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    editAssessment(lessonId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield lessonModel_1.lessonModel.findByIdAndUpdate(lessonId, { $set: { assessment: updatedData } }, { new: true });
            }
            catch (error) {
                console.log("instructor repository error:edit assessment", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(courseId);
                if (!course) {
                    throw new Error('course not found');
                }
                if (course.isPublished) {
                    throw new Error('course already published');
                }
                return yield courseModel_1.courseModel.findByIdAndUpdate(courseId, { isPublished: true }, { new: true });
            }
            catch (error) {
                console.log("instructor repository error:edit lesson", error);
                throw new Error(` ${error.message}`);
            }
        });
    }
    getLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield lessonModel_1.lessonModel.findById(lessonId);
                return lesson;
            }
            catch (error) {
                console.error("Error in InstructorRepository.getLessonById:", error);
                throw new Error(`Error fetching lesson: ${error.message}`);
            }
        });
    }
    updateLessonAssessment(lessonId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield lessonModel_1.lessonModel.findByIdAndUpdate(lessonId, { assessment: questions }, { new: true, runValidators: true });
                if (!lesson) {
                    throw new Error("Lesson not found during update");
                }
                return lesson;
            }
            catch (error) {
                console.error("Error in InstructorRepository.updateLessonAssessment:", error);
                throw new Error(`Error updating lesson assessment: ${error.message}`);
            }
        });
    }
    getInstructorProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findById(userId);
            }
            catch (error) {
                console.error("Error fetching instructor profile:", error);
                throw new Error("Failed to fetch instructor profile");
            }
        });
    }
    updateInstructor(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return userModel_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userId), role: 'instructor' }, { $set: updateData }, { new: true } // Return the updated document
                ).exec();
            }
            catch (error) {
                console.error("Error updating instructor profile:", error);
                throw new Error("Failed to update instructor profile");
            }
        });
    }
    findLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield lessonModel_1.lessonModel.findById(lessonId);
                return lesson;
            }
            catch (error) {
                console.log('find lesson by id error:', error);
                throw new Error(`Error fetching lesson`);
            }
        });
    }
}
exports.InstructorRepository = InstructorRepository;
