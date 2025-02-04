import { Request, Response } from "express";
import { IUser, Role } from "../interfaces/user/IUser";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { clearTokenCookie, setTokenCookie } from "../util/auth/jwt";

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

      if(!email || !otp){
        res.status(400).json({success:false, message:'email and otp are required'});
        return
      }

      const { message, token, user} = await this.userService.verifyOtp(email,otp)
      if(!token){
        throw new Error('token not generated')
      }

      setTokenCookie(res, token)
      res.status(200).json({success:true, message, data:user})

    } catch (error:any) {
      console.log('controller error',error)
      res.status(400).json({message: error.message})
    }
  }


  async logout(req: Request, res: Response):Promise<void>{
    try {
      
      clearTokenCookie(res)
      res.status(500).json({ success: true, message: 'Logged out successful' })
    } catch (error:any) {
      console.log('controller error',error)
      res.status(400).json({message: error.message})
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      let roleInput: Role = Role.Pending;
      const {email, password, role } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required." });
        return;
        }

      if (role && Object.values(Role).includes(role as Role)) {
        roleInput = role as Role;
      }
      const userData: Partial<IUser> = {
        email,
        password,
        role: roleInput,
      };

      const { message, user, token} = await this.userService.loginAction(userData);
      if(!token){
        throw new Error('token not generated')
      }

      setTokenCookie(res, token)
      res.status(201).json({ success: true, message: message, data:user });
    } catch (error:any) {
        res.status(400).json({ message: error.message })
    }
  }
}
