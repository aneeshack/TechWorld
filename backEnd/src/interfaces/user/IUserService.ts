import { IUser } from "./IUser";

export interface IAuthService{
    createUser(userData: Partial<IUser>): Promise<IUser>;
    // verifyOtp(email: string, otp: string): Promise<boolean>;
    // loginUser(email: string, password: string): Promise<{
    //     token:string,
    //     user:IUser
    // }>
}