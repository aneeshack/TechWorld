export interface IReply {
  _id?: string;
  content?: string;
  author?: {
    _id:string,
    userName?:string,
    profile?:{
      avatar?:string
    }
  }
  createdAt?: Date;
}


export interface IDiscussion  {
  _id: string,
  title?: string;
  content?: string;
  author?: {
    _id:string,
    userName?:string,
    profile?:{
      avatar?:string
    }
  };
  course?: {
    title?:string,
    _id?:string
  };
  category?: string ;
  tags?: string[];
  upvotes?: number;
  replies?: number;
  views?: number;
  isResolved: boolean;
  voters?:string[];
  repliesList?: IReply[];
  createdAt?: Date;
  updatedAt?: Date;
}