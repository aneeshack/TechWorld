// src/interfaces/dtos/UserDTO.ts
export interface UserDTO {
    _id:string,
    userName: string;
    email: string;
    role: string;
    requestStatus?: string; 
    isBlocked?:boolean
  }
  
  // src/interfaces/dtos/CategoryDTO.ts
  export interface CategoryDTO {
    categoryName: string;
    description: string;
    imageUrl: string;
  }
  
  // src/interfaces/dtos/PaymentDTO.ts
  export interface PaymentDTO {
    userName: string;
    courseTitle: string;
    amount: number;
    status: string;
    createdAt: Date;
  }