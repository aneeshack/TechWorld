import { Request, Response } from "express";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser, Role } from "../interfaces/user/IUser";
import UserModel from "../models/userModel";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new UserRepository());
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      let roleInput: Role = Role.Pending;
      const { userName, email, password, confirmPassword, role } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required." });
        return;
        }

      if (role && Object.values(Role).includes(role as Role)) {
        roleInput = role as Role;
      }
      const userData: Partial<IUser> = {
        userName,
        email,
        password,
        confirmPassword,
        role: roleInput,
        isOtpVerified: false,
      };

      const result = await this.userService.signup(userData);
      res.status(201).json({ success: true, message: result.message });
    } catch (error:any) {
        res.status(400).json({ message: error.message })
    }
  }

  async verifyOtp(req:Request, res: Response):Promise<void>{
    try {
      const { email, otp} = req.body
      console.log(req.body)

      if(!email || !otp){
        res.status(400).json({success:false, message:'email and otp are required'});
        return
      }

      const { message, token, user} = await this.userService.verifyOtp(email,otp)
      res.status(200).json({success:true, message, token, user})
    } catch (error:any) {
      console.log('controller error',error)
      res.status(400).json({message: error.message})
    }
  }
}
