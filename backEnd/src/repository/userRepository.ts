import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import OtpModel from "../models/otpModel";
import UserModel from "../models/userModel";


export class UserRepository implements IUserRepository{

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            return await UserModel.findOne({email});
        } catch (error) {
            console.log('userRepository error:finbyemail',error)
            throw new Error(`Error in finding Email: ${(error as Error).message}`)
        }
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            const user = new UserModel(userData);
            return await user.save();
        } catch (error) {
            console.log('userRepository error:createUser',error)
            throw new Error(`Error in creating user: ${(error as Error).message}`)
        }
    }

    async updateUser(email: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
             const user =await UserModel.findOneAndUpdate({email},{$set:updateData},{new:true})

            if(!user){
                throw new Error('User update failed. No user found.')
            }
            return user
        } catch (error) {
            console.log('userRepository error:updateUser',error)
            throw new Error(`Error in updating user: ${(error as Error).message}`)
        }
    }

    async createOtp(otpData: { email: string; otp: string; }): Promise<void> {
        try {
            const otp = new OtpModel(otpData)
            otp.save()
        } catch (error) {
            console.log('userRepository error:create otp',error)
            throw new Error(`Error in creating otp: ${(error as Error).message}`)
        }
    }

    async findOtpByEmail(email: string): Promise<{ email: string; otp: string; } | null> {
        try {
            return await OtpModel.findOne({email})
        } catch (error) {
            console.log('userRepository error: find otp by email',error)
            throw new Error(`Error in finding otp by email: ${(error as Error).message}`)
        }
    }

    async deleteOtp(email: string): Promise<void> {
        try {
            await OtpModel.deleteOne({email})
        } catch (error) {
            console.log('userRepository error: delete otp',error)
            throw new Error(`Error in deleting otp: ${(error as Error).message}`)
        }
    }

    async verifyUser(email: string, password: string):Promise<IUser>{
        try {
            const user = await UserModel.findOne({email, password})
            if(!user){
                throw new Error('user not found')
            }
            if(!user.isOtpVerified){
                throw new Error('OTP not verified. Signup again')
            }

            return user
        } catch (error) {
            console.log('userRepository error: login user',error)
            throw new Error(` ${(error as Error).message}`)
        }
    }
}