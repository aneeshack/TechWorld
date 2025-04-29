export  interface IFinalAssessment {
  completed: boolean;
  score: number;
}

export interface IEnrollment{
  _id:string,
  userId: string;
  courseId: string;
  enrolledAt?: Date;
  completionStatus: "enrolled" | "in-progress" | "completed";
  progress: {
    completedLessons: string[];
    finalAssessment: IFinalAssessment;
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
  courseDetails?: {
    title: string;
    description: string;
    thumbnail: string;
    category?: {
      _id: string,
      categoryName: string;
    };
    instructor?: {
      _id: string,
      userName: string
    }
  };
}
