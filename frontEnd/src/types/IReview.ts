
export interface IReview  {
    _id?:string,
    courseId?: string;
    studentId?: {
      userName?:string
    };
    rating?: number;
    reviewText?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  