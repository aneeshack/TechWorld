import { Types } from "mongoose";
import { ICourse } from "../interfaces/courses/ICourse";
import { IDiscussion, IReply } from "../interfaces/courses/IDiscussion";
import { courseModel } from "../models/courseModel";
import { DiscussionModel } from "../models/discussionModel";

export class DiscussionRepository {
    async createDiscussion(discussion: Partial<IDiscussion>): Promise<IDiscussion> {
        const newDiscussion = new DiscussionModel(discussion);
        await newDiscussion.save();
        return newDiscussion;
      }
    
      async findCourseById(courseId: string): Promise<ICourse | null> {
        return courseModel.findById(courseId);
      }
    
      async findDiscussionById(id: string): Promise<IDiscussion | null> {
        return DiscussionModel.findById(id)
          .populate('author', 'userName profile')
          .populate('course', 'title');
      }

      async findById(id: string): Promise<IDiscussion | null> {
        if (!Types.ObjectId.isValid(id)) {
          return null;
        }
        return await DiscussionModel.findById(id).populate('author course repliesList.author');
      }
    
      async updateUpvotes(id: string, upvotes: number): Promise<IDiscussion | null> {
        
        return await DiscussionModel.findByIdAndUpdate(
          id,
          { upvotes },
          { new: true }
        ).populate('author course voters repliesList.author');
      }

      async createReply(discussionId: string, replyData: Partial<IReply>): Promise<IDiscussion | null> {
        return await DiscussionModel.findByIdAndUpdate(
          discussionId,
          {
            $push: { repliesList: replyData },
            $inc: { replies: 1 },
            isResolved:true
          },
          { new: true }
        ).populate('author course voters repliesList.author');
      }
}