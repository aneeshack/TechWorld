import { model, Schema } from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";

const categorySchema = new Schema({
    categoryName:{
        type:String,
        required:true
    },
    isActive:{
        type: Boolean,
        default:true,
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type: String,
        required:true
    },
    count:{
        type:Number,
        default:0
    }
},{
    timestamps:true
}
)
export const Category=model<CategoryEntity>("categories",categorySchema)