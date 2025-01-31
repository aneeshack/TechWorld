import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import UserModel from "../models/userModel";

export class UserRepository implements IUserRepository{

    async findByEmail(email: string): Promise<IUser | null> {
        try {
         return await UserModel.findOne({email})
        } catch (error) {
            console.log('error in userRepository',error)
         throw new Error(`Error in finding Email: ${(error as Error).message}`)
        }
     }
     
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            const user = new UserModel(userData)
        return await user.save()
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Error while creating user: ${error.message}`)
            }else{
                throw new Error("An unknown error occurred while creating the user.");
            }
        }
        
    }
}