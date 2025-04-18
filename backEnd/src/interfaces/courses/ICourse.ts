import mongoose,{Document} from "mongoose";
import { IEnrollment } from "../database/IEnrollment";

export interface ICourse extends Document{
    title:string,
    description:string,
    thumbnail:string,
    instructor:mongoose.Types.ObjectId 
    category:mongoose.Types.ObjectId,
    price:number,  
    language:string,
    duration:string,
    isPublished: boolean,
    lessons:mongoose.Types.ObjectId[]
    rating: number,
    isBlocked: boolean,
    createdAt: Date;
    updatedAt: Date;
}


export interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
  }

 export interface PaginationResult {
    courses: IEnrollment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalItems: number;
    };
  }