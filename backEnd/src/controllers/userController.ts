import { Request, Response } from "express";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser, Role } from "../interfaces/user/IUser";
import UserModel from "../models/userModel";

export class UserController {
    constructor(
        private userService: IUserService,
        private userRepository: IUserRepository
    ){}

    async createUser(req:Request, res:Response):Promise<void>{
        try {
            let roleInput:Role = Role.Pending ;
            const {userName, email, password, confirmPassword,role } = req.body;
            
            if(role && Object.values(Role).includes(role as Role)){
               roleInput = role as Role
            }

            console.log('body',req.body)
            const newUser: Partial<IUser> = {
                userName: userName,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                role: roleInput, 
              };

            const user = await this.userService.createUser(newUser)
            if(!user){
                console.log('error in controller')
                throw new Error('error in controller')
            }
            console.log('user',user)
            res.status(201).json({success:true,data:user})
        } catch (error) {
            console.log('error in creating user')
            // throw new Error(`Error in creating user ${(error as Error).message}`)
            res.status(400).json({ success: false, message: `${(error as Error).message}` });
        }
    }

}