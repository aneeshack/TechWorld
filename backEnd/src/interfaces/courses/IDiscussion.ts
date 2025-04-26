import mongoose, { Document } from 'mongoose';

export interface IReply {
  _id: string;
  content: string;
  author: mongoose.Types.ObjectId | { _id: string; userName: string; profile: { avatar: string } };
  createdAt: Date;
}


export interface IDiscussion extends Document {
  _id:mongoose.Types.ObjectId,
  title: string;
  content: string;
  author: mongoose.Types.ObjectId | string;
  course: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId ;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  isResolved: boolean;
  voters?:string[] |mongoose.Types.ObjectId[];
  repliesList?: IReply[];
  createdAt: Date;
  updatedAt: Date;
}