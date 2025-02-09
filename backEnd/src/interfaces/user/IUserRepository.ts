import { IUser } from "./IUser";

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    createUser(userData: Partial<IUser>): Promise<IUser>;
    updateUser(email: string, updateData: Partial<IUser>): Promise<IUser |null>;
    createOtp(otpData: {email: string, otp: string}): Promise<void>;
    findOtpByEmail(email: string): Promise<{email: string, otp: string} |null>;
    deleteOtp(email: string): Promise<void>;
    verifyUser(email: string, password:string):Promise<IUser>;
    updateRegister(userData: Partial<IUser>):Promise<IUser |null>
}