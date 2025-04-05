"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.lessonModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const assessmentSchema = new mongoose_1.Schema({
    question: { type: String, required: false },
    options: [
        {
            text: { type: String, required: false },
            isCorrect: { type: Boolean, required: false },
        },
    ],
});
const lessonSchema = new mongoose_1.Schema({
    lessonNumber: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: false
    },
    pdf: {
        type: String,
        required: false
    },
    isTrial: {
        type: Boolean,
        default: false,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    assessment: [{
            type: assessmentSchema,
            required: false
        }]
});
lessonSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const lessonModel = mongoose_1.default.model("lessons");
        if (!this.lessonNumber) {
            try {
                const lastLesson = yield lessonModel.findOne({ course: this.course }).sort({ lessonNumber: -1 });
                this.lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1; // Start from 1 if no lessons exist 
                next();
            }
            catch (error) {
                next(error);
            }
        }
        else {
            next();
        }
    });
});
exports.lessonModel = (0, mongoose_1.model)("lessons", lessonSchema);
