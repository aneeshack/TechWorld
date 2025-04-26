import { IDiscussion } from "../courses/IDiscussion";

export interface IDiscussionService{
   createDiscussion(
       title: string,
       content: string,
       courseId: string,
       authorId: string,
       tags: string[]
     ): Promise<IDiscussion>;
     upvoteDiscussion(id: string, userId: string): Promise<IDiscussion | null>;
     createReply(content: string, discussionId: string, authorId: string): Promise<IDiscussion | null>
}