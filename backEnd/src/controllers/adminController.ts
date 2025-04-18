import { Request, Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { paymentModel } from "../models/paymentModel";
import { throwError } from "../middlewares/errorMiddleware";
import { HTTP_STATUS, MESSAGES } from "../constants/httpStatus";
import { PipelineStage } from 'mongoose';

export class AdminController{
    constructor(private _adminService: IAdminService){}
    
    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {

            const allRequsts = await this._adminService.getAllRequsts()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async rejectedInstructors(req: Request, res:Response):Promise<void>{
        try { 
         
            const allRequsts = await this._adminService.getAllRejectedRequests()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async approveInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.approveRequest(userId)
            res.status(HTTP_STATUS.OK).json({ success: true, message:MESSAGES.INSTRUCTOR_APPROVED, updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async rejectInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.rejecteRequest(userId)
            res.status(HTTP_STATUS.OK).json({ success: true, message:MESSAGES.INSTRUCTOR_REJECTED, updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const search = req.query.search as string || '';
      
          const { users, totalUsers, totalPages } = await this._adminService.getAllUsers({
            page,
            limit,
            search
          });
      
          res.status(200).json({
            success: true,
            data: users,
            totalUsers,
            totalPages,
            currentPage: page
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR;
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: message
          });
        }
      }


    async blockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const io = req.app.get("io");
            
            const blockedUser = await this._adminService.blockUser(userId)

            if (blockedUser && blockedUser._id) {
              io.to(blockedUser._id.toString()).emit("user-blocked");
            }
            res.status(HTTP_STATUS.OK).json({ success:true, message:MESSAGES.USER_BLOCKED,blockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async unBlockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const unblockedUser = await this._adminService.unBlockUser(userId)
            res.status(HTTP_STATUS.OK).json({ success:true, message:MESSAGES.USER_UNBLOCKED,unblockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getPresignedUrl(req:Request, res: Response):Promise<void>{
        try {
            const { fileName, fileType } = req.body
            const { presignedUrl, imageUrl} = await this._adminService.getPresignedUrl(fileName, fileType)

            res.json({ presignedUrl, imageUrl });
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async addCategory(req:Request, res: Response):Promise<void>{
        try {
            const { categoryName, description, imageUrl } = req.body
            if(!categoryName || !description || !imageUrl){
                throwError(HTTP_STATUS.BAD_REQUEST,MESSAGES.REQUIRED );
            }
            const newCategory = await this._adminService.createCategory(categoryName, description, imageUrl )

            if (!newCategory) {
                throwError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Error in creating new category.");
            }

            res.status(HTTP_STATUS.CREATED).json({success:true, message:MESSAGES.CATEGORY_CREATED,newCategory});
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getAllCategories(req:Request, res: Response):Promise<void>{
        try {
            const allCategories = await this._adminService.getAllCategories()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allCategories });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getSingleCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;
            const category = await this._adminService.getCategoryById(categoryId)

            res.status(HTTP_STATUS.OK).json({ success: true, data:category });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async editCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;

            if(!categoryId){
                throwError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REQUIRED);
            }
             
            const { categoryName, description, imageUrl} = req.body
            const updateCategory = await this._adminService.updateCategory(categoryId,{
                categoryName,
                description,
                imageUrl
            })

            res.status(HTTP_STATUS.OK).json({ success: true, data:updateCategory });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

  
async fetchPayments (req: Request, res: Response): Promise<void> {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const trimmedSearch = (search as string).trim();

    // Build search conditions for aggregation
    const searchMatch: PipelineStage.Match = trimmedSearch
      ? {
          $match: {
            $or: [
              { 'userId.userName': { $regex: trimmedSearch, $options: 'i' } },
              { 'userId.email': { $regex: trimmedSearch, $options: 'i' } },
              { 'courseId.title': { $regex: trimmedSearch, $options: 'i' } },
            ],
          },
        }
      : { $match: {} };

    // Aggregation pipeline for payments
    const paymentsPipeline: PipelineStage[] = [
      // Step 1: Lookup userId to join with users collection
      {
        $lookup: {
          from: 'users', // Collection name for User model
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      // Step 2: Unwind userId to convert array to single object
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 3: Lookup courseId to join with courses collection
      {
        $lookup: {
          from: 'courses', // Collection name for Course model
          localField: 'courseId',
          foreignField: '_id',
          as: 'courseId',
        },
      },
      // Step 4: Unwind courseId
      {
        $unwind: {
          path: '$courseId',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 5: Apply search conditions
      searchMatch,
      // Step 6: Sort by createdAt descending
      {
        $sort: {
          createdAt: -1,
        },
      },
      // Step 7: Pagination
      { $skip: skip },
      { $limit: limitNum },
      // Step 8: Project to match IPayment structure
      {
        $project: {
          _id: 1,
          userId: {
            userName: '$userId.userName',
            email: '$userId.email',
          },
          courseId: {
            title: '$courseId.title',
            price: '$courseId.price',
          },
          amount: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ];

    // Aggregation pipeline for total count and total sales
    const countAndSalesPipeline: PipelineStage[] = [
      // Reuse the same lookup and match stages
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'courseId',
        },
      },
      {
        $unwind: {
          path: '$courseId',
          preserveNullAndEmptyArrays: true,
        },
      },
      searchMatch,
      // Group to calculate total count and sales
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalSales: { $sum: '$amount' },
        },
      },
    ];

    // Execute aggregations
    const [paymentsResult, countAndSalesResult] = await Promise.all([
      paymentModel.aggregate(paymentsPipeline),
      paymentModel.aggregate(countAndSalesPipeline),
    ]);

    // Extract results
    const payments = paymentsResult;
    const totalPayments = countAndSalesResult[0]?.totalPayments || 0;
    const totalSales = countAndSalesResult[0]?.totalSales || 0;

    // Log for debugging
    console.log('Search conditions:', JSON.stringify(searchMatch, null, 2));
    console.log('Fetched payments:', payments.length, 'Total payments:', totalPayments);

    // Prevent caching
    res.set('Cache-Control', 'no-store');

    res.json({
      payments,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limitNum),
      currentPage: pageNum,
      totalSales,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch payments' });
  }
};

    async getPresignedUrlForImage(req: Request, res: Response): Promise<void> {
        try {
          const { categoryId } = req.params;
          if(!categoryId){
            throwError(HTTP_STATUS.BAD_REQUEST,'Category id not found')
          }

      
          const presignedUrl = await this._adminService.getPresignedUrlForCategoryImage(categoryId)
         
          res.json({ presignedUrl });
        } catch (error) {
          console.error("Error in InstructorController :get presigned url for video", error);
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
        }
      }
}