import { Types } from "mongoose";

export interface CategoryEntity {
	_id: Types.ObjectId;
	categoryName: string;
    description:string;
    imageUrl?:string;
	isActive?: boolean;
	count?:number;
}