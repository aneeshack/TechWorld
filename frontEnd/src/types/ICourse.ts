
export interface ICourse {
    _id?: string,
    title?:string,
    description?:string,
    thumbnail?:string,
    instructor:string 
    category:{
        _id:string,
        categoryName: string
    },
    price:number,  
    language?:string,
    duration?:string,
    isPublished?: boolean,
    lessons?:string[]
    rating?: number,
    isBlocked?: boolean,
}
