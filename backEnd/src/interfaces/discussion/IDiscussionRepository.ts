import { ICourse } from "../courses/ICourse";
import { IDiscussion, IReply } from "../courses/IDiscussion";

export interface IDiscussionRepository{
    createDiscussion(discussion: Partial<IDiscussion>): Promise<IDiscussion>;
    findCourseById(courseId: string): Promise<ICourse | null>;
    findDiscussionById(id: string): Promise<IDiscussion | null>;
    findById(id: string): Promise<IDiscussion | null>;
    updateUpvotes(id: string, upvotes: number): Promise<IDiscussion | null>;
    createReply(discussionId: string, replyData: Partial<IReply>): Promise<IDiscussion | null> 
}