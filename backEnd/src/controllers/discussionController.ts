import { query, Request, Response } from "express";
import { HTTP_STATUS, MESSAGES } from "../constants/httpStatus";
import { IDiscussionService } from "../interfaces/discussion/IDiscussionService";
import { AuthRequest } from "../middlewares/adminAuth";
import { throwError } from "../middlewares/errorMiddleware";
import { Types } from "mongoose";
import { DiscussionModel } from "../models/discussionModel";

export class DiscussionController{
    constructor(
        private _discussionService: IDiscussionService,
    ){}

    

    async createDiscussion (req: AuthRequest, res: Response){
        try {
          console.log('req.body',req.body)
            const { title, content, courseId, tags } = req.body;
            const authorId = req.user?.id
      
            if (!authorId) {
              throwError(HTTP_STATUS.UNAUTHORIZED, 'unauthorized access')
            }
      
            if (!title || !content || !courseId ) {
              console.log('first')
              throwError(HTTP_STATUS.BAD_REQUEST,'Missing required fields')
            }
      
            
              // Validate ObjectId formats
          if (!authorId || !Types.ObjectId.isValid(authorId) || !Types.ObjectId.isValid(courseId) ) {
            throwError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID format');
          }

            const tagArray = typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()) : tags || [];
            const discussion = await this._discussionService.createDiscussion(
              title,
              content,
              courseId,
              authorId!.toString(),
              tagArray
            );
            console.log('discussion',discussion)
      
            res.status(HTTP_STATUS.CREATED).json({success:true, discussion});
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message || 'Server error' });
          }
      };
      
      // Get discussions with filtering and sorting
      async getDiscussions (req: Request, res: Response) {
        try {
          const { courseId, search = '', sort = 'recent', page = 1, limit = 10 } = req.query;

          const query: any = {course:courseId};
      
          // Search by title, content, or tags
          if (search) {
            query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { content: { $regex: search, $options: 'i' } },
              { tags: { $regex: search, $options: 'i' } },
            ];
          }
      
      
          // Sorting options
          let sortOption: any;
          switch (sort) {
            case 'popular':
              sortOption = { upvotes: -1 };
              break;
            case 'most-replies':
              sortOption = { replies: -1 };
              break;
            case 'recent':
            default:
              sortOption = { createdAt: -1 };
          }
      
          const skip = (Number(page) - 1) * Number(limit);
      
          const discussions = await DiscussionModel.find(query)
            .populate('author', 'userName profile')
            .populate('course', 'title')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));
      
          const total = await DiscussionModel.countDocuments(query);
          console.log('discussion and total',discussions,total)
          res.status(HTTP_STATUS.OK).json({
            success:true,
            discussions,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
          });
        } catch (error) {
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false, message: 'Server error', error });
        }
      };
      
      async upvoteDiscussion(req: AuthRequest, res: Response): Promise<void> {
        try {
          const { id } = req.params;
          const userId = req.user?.id;

          if (!userId) {
              throwError(HTTP_STATUS.BAD_REQUEST,MESSAGES.REQUIRED );
              return
            }

          const discussion = await this._discussionService.upvoteDiscussion(id, userId.toString());
          res.status(HTTP_STATUS.OK).json({ success: true, discussion });
        } catch (error) {
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error',
            error,
          });
        }
      }


      async createReply(req: AuthRequest, res: Response):Promise<void> {
        try {
          const { content, discussionId } = req.body;
          const authorId = req.user?.id; 

          if (!authorId) {
              throwError(HTTP_STATUS.UNAUTHORIZED, 'unauthorized access')
            }


          const discussion = await this._discussionService.createReply(content, discussionId, authorId!.toString());
          res.status(201).json({ success: true, discussion });
        } catch (error: any) {
          res.status(error.status || 500).json({ success: false, message: error.message });
        }
      };

      // // Mark discussion as resolved
      // async markAsResolved (req: AuthRequest, res: Response) {
      //   try {
      //     const { id } = req.params;
      //     const userId = req.user?.id;
      
      //     if (!userId) {
      //       return res.status(401).json({ message: 'Unauthorized' });
      //     }
      
      //     const discussion = await DiscussionModel.findById(id);
      //     if (!discussion) {
      //       return res.status(404).json({ message: 'Discussion not found' });
      //     }
      
      //     // Only allow author or admin to mark as resolved
      //     if (discussion.author.toString() !== userId) {
      //       const user = await UserModel.findById(userId);
      //       if (user?.role !== 'admin') {
      //         return res.status(403).json({ message: 'Forbidden' });
      //       }
      //     }
      
      //     discussion.isResolved = true;
      //     await discussion.save();
      
      //     res.status(200).json(discussion);
      //   } catch (error) {
      //     res.status(500).json({ message: 'Server error', error });
      //   }
      // };
}