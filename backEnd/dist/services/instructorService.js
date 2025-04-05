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
exports.InstructorService = void 0;
class InstructorService {
    constructor(instructorRepository, s3Service) {
        this._instructorRepository = instructorRepository;
        this._s3Service = s3Service;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this._instructorRepository.fetchCategories();
                if (!categories) {
                    throw new Error("No categories found");
                }
                return categories;
            }
            catch (error) {
                console.error("instructorService error:get all categories", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this._instructorRepository.addCourse(courseData);
                if (!course) {
                    throw new Error("No course found");
                }
                return course;
            }
            catch (error) {
                console.error("instructorService error: create course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this._instructorRepository.editCourse(courseId, courseData);
                if (!course) {
                    throw new Error("No course found");
                }
                return course;
            }
            catch (error) {
                console.error("instructorService error: update course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    fetchAllCourses(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this._instructorRepository.getAllCoursesByInstructor(instructorId);
                console.log('all courses in service', courses);
                if (!courses) {
                    throw new Error("No courses found");
                }
                return courses;
            }
            catch (error) {
                console.error("instructorService error: update courses", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    fetchCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._instructorRepository.getSingleCourse(courseId);
            }
            catch (error) {
                console.error("instructorService error: fetch course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getPresignedUrl(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = `course/${Date.now()}-${encodeURIComponent(fileName)}`;
                const result = yield this._s3Service.generatePresignedUrlForUpload(key, fileType, 60);
                console.log("Generated Video URL:", result.videoUrl);
                return result;
            }
            catch (error) {
                console.error("InstructorService Error: Presigned URL generation failed", error);
                throw new Error(`Error generating presigned URL: ${error.message}`);
            }
        });
    }
    addLesson(lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield this._instructorRepository.addLesson(lessonData);
                if (!lesson) {
                    throw new Error("No lesson found");
                }
                return lesson;
            }
            catch (error) {
                console.error("instructorService error: create lesson", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    allLessons(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessons = yield this._instructorRepository.courseLessons(courseId);
                if (!lessons || lessons.length === 0) {
                    throw new Error("No lessons found in this course");
                }
                return lessons;
            }
            catch (error) {
                console.error("instructorService error: fetching lessons", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    fetchLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._instructorRepository.getSingleLesson(lessonId);
            }
            catch (error) {
                console.error("instructorService error: fetch lesson", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    updateLesson(lessonId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lesson = yield this._instructorRepository.editLesson(lessonId, updateData);
                if (!lesson) {
                    throw new Error("No lesson found");
                }
                return lesson;
            }
            catch (error) {
                console.error("instructorService error: update lesson", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this._instructorRepository.publishCourse(courseId);
                if (!course) {
                    throw new Error("No course found");
                }
                return course;
            }
            catch (error) {
                console.error("instructorService error: publish course", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    addAssessment(lessonId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!lessonId) {
                    throw new Error("Lesson ID is required");
                }
                if (!questions || !Array.isArray(questions)) {
                    throw new Error("Questions must be provided as an array");
                }
                const lesson = yield this._instructorRepository.getLessonById(lessonId);
                if (!lesson) {
                    throw new Error("Lesson not found");
                }
                // Update assessment
                const updatedLesson = yield this._instructorRepository.updateLessonAssessment(lessonId, questions);
                return updatedLesson;
            }
            catch (error) {
                console.error("Error in InstructorService.addOrUpdateAssessment:", error);
                throw error; // Propagate error to controller
            }
        });
    }
    fetchInstructorProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this._instructorRepository.getInstructorProfile(userId);
                if (!instructor) {
                    throw new Error("Instructor not found");
                }
                return instructor;
            }
            catch (error) {
                console.error("instructorService error: instructor profile", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    updateInstructorProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this._instructorRepository.updateInstructor(userId, updateData);
                if (!instructor) {
                    throw new Error('Instructor not found');
                }
                return instructor;
            }
            catch (error) {
                console.error("instructorService error: instructor profile updating", error);
                throw new Error(`${error.message}`);
            }
        });
    }
}
exports.InstructorService = InstructorService;
