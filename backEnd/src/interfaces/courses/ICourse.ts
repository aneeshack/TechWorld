import mongoose,{Schema,Document} from "mongoose";

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
}
