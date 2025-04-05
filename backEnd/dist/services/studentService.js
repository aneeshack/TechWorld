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
exports.StudentService = void 0;
class StudentService {
    constructor(_studentRepository) {
        this._studentRepository = _studentRepository;
    }
    fetchStudentProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this._studentRepository.getStudentProfile(userId);
                if (!student) {
                    throw new Error("student not found");
                }
                return student;
            }
            catch (error) {
                console.error("studentService error: student profile", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    updateStudentProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this._studentRepository.updateStudent(userId, updateData);
                if (!student) {
                    throw new Error('student not found');
                }
                return student;
            }
            catch (error) {
                console.error("studentService error: student profile updating", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getPaymentsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentPayment = yield this._studentRepository.fetchPayment(userId);
                if (!studentPayment) {
                    throw new Error('student Payment history not found');
                }
                return studentPayment;
            }
            catch (error) {
                console.error("studentService error: student payment updating", error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getEnrolledCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this._studentRepository.enrolledCourses(userId);
                if (!enrolledCourses) {
                    throw new Error("enrolledCourses not found");
                }
                return enrolledCourses;
            }
            catch (error) {
                console.error('student service error:enrolled courses ', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    getEnrollment(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this._studentRepository.studentCourseEnrollment(userId, courseId);
                if (!enrolledCourses) {
                    throw new Error("enrolledCourses not found");
                }
                return enrolledCourses;
            }
            catch (error) {
                console.error('student service error:user course enrollment ', error);
                throw new Error(`${error.message}`);
            }
        });
    }
    addReview(studentId, courseId, rating, reviewText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingReview = yield this._studentRepository.getReview(studentId, courseId);
                if (existingReview) {
                    // Update existing review
                    return yield this._studentRepository.updateReview(studentId, courseId, rating, reviewText);
                }
                else {
                    // Create new review
                    return yield this._studentRepository.createReview(studentId, courseId, rating, reviewText);
                }
            }
            catch (error) {
                console.error('student service error:user course rating ', error);
                throw new Error(`${error.message}`);
            }
        });
    }
}
exports.StudentService = StudentService;
