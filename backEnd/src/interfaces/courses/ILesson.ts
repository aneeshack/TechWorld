import mongoose, { Document } from "mongoose";

export interface IAssessment {
    question: string,
    options: {
        text: string,
        isCorrect: boolean
    }[]
}

export interface ILesson extends Document{
    lessonNumber: number,
    title: string,
    thumbnail: string,
    description: string,
    video: string,
    duration?: string,
    course: mongoose.Types.ObjectId,
    pdf?: string,
    isTrial: boolean,
    assessment?: IAssessment 
}
