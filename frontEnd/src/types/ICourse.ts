
export interface IAssessment {
    question?: string,
    options?: {
        text: string,
        isCorrect: boolean
    }[]
}

export interface ILesson{
    _id:string,
    lessonNumber?: number,
    title: string,
    thumbnail: string,
    description: string,
    video: string,
    duration?: string,
    course?:string,
    pdf?: string,
    isTrial: boolean,
    assessment?: IAssessment 
}

export interface IInstructor {
    userName: string;
}
export interface ICourse {
    _id?: string,
    title?:string,
    description?:string,
    thumbnail?:string,
    instructor:{
        _id:string,
        userName: string,
        email?: string,
        profile?: string
    },
    category:{
        _id:string,
        categoryName: string,
        description?:string,
        imageUrl?:string
    },
    price:number,  
    language?:string,
    duration?:string,
    isPublished?: boolean,
    lessons?:ILesson[],
    lessonCount?:number,
    rating?: number,
    isBlocked?: boolean,
}
