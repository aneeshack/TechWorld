

export interface IEnrollment{
  userId: string;
  courseId: string;
  enrolledAt?: Date;
  completionStatus: "enrolled" | "in-progress" | "completed";
  progress: {
    completedLessons: string[];
    completedAssessments: string[];
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
  courseDetails?: {
    title: string;
    description: string;
    thumbnail: string;
    category: {
      categoryName: string;
    };
  };
}
