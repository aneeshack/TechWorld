import { Types } from "mongoose";
import { IDiscussion, IReply } from "../interfaces/courses/IDiscussion";
import { IDiscussionRepository } from "../interfaces/discussion/IDiscussionRepository";
import { throwError } from "../middlewares/errorMiddleware";
import { HTTP_STATUS, MESSAGES } from "../constants/httpStatus";

export class DiscussionService{
   constructor(private _discussionRepository: IDiscussionRepository){}

   async createDiscussion(
    title: string,
    content: string,
    courseId: string,
    authorId: string,
    tags: string[]
  ): Promise<IDiscussion> {
    try {
        const course = await this._discussionRepository.findCourseById(courseId);
        if (!course) {
            console.log('no course found',)
          throw new Error('Course not found');
        }
    
    
        // Prepare discussion data
        const discussionData: Partial<IDiscussion> = {
          title,
          content,
          author: new Types.ObjectId(authorId),
          course: new Types.ObjectId(courseId),
          tags: tags || [],
        };
    
        // Create discussion
        const discussion = await this._discussionRepository.createDiscussion(discussionData);
    
        if (!discussion) {
            throw new Error('No discussion found');
          }
      
        // Retrieve populated discussion
        const populatedDiscussion = await this._discussionRepository.findDiscussionById(discussion._id.toString());
        if (!populatedDiscussion) {
          throw new Error('Failed to retrieve created discussion');
        }
    
        return populatedDiscussion;
        
    } catch (error) {
        console.error("discussion error: create a new discussion", error);
        throw new Error(`${(error as Error).message}`);
    }
}

async upvoteDiscussion(id: string, userId: string): Promise<IDiscussion | null> {
    try {
        if (!userId) {
          throwError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REQUIRED);
        }
    
        const discussion = await this._discussionRepository.findById(id);
        if (!discussion) {
          throwError(HTTP_STATUS.NOT_FOUND, MESSAGES.REQUIRED);
        }
    
        
        const newUpvoteCount = (discussion?.upvotes || 0) + 1;
        const updatedDiscussion = await this._discussionRepository.updateUpvotes(id, newUpvoteCount);
        if (!updatedDiscussion) {
          throwError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to update discussion');
        }
    
        return updatedDiscussion;
        
    } catch (error) {
        console.error("upvote discussion error: upvote a discussion", error);
        throw new Error(`${(error as Error).message}`);
    }
}

async createReply(content: string, discussionId: string, authorId: string): Promise<IDiscussion | null> {
  try {
    if (!content || !discussionId || !authorId) {
      throwError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REQUIRED);
    }

    const discussion = await this._discussionRepository.findById(discussionId);
    if (!discussion) {
      throwError(HTTP_STATUS.NOT_FOUND, MESSAGES.REQUIRED);
    }

    const replyData: Partial<IReply> = {
      content,
      author: new Types.ObjectId(authorId),
    };

    const updatedDiscussion = await this._discussionRepository.createReply(discussionId, replyData);
    if (!updatedDiscussion) {
      throwError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create reply');
    }

    return updatedDiscussion;
  } catch (error) {
    console.error('reply error: create a new reply', error);
    throw new Error(`${(error as Error).message}`);
  }
}
}