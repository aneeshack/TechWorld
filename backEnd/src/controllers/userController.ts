import { Request, Response } from "express";
import { IUser, Role } from "../interfaces/user/IUser";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { clearTokenCookie, setTokenCookie } from "../util/auth/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";
import { error } from "console";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new UserRepository());
  }

  async fetchUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        return;
      }

      const user = await this.userService.getUserById(req.user.id);
      res.status(200).json({ success: true, user });
      return;
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      let roleInput;
      const { userName, email, password, confirmPassword, role } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required." });
        return;
        }

        if (!role && !Object.values(Role).includes(role as Role)) {
          res.status(400).json({ success: false, message: "Invalid or missing role." });
          return;       
        }

        roleInput = role as Role;
        console.log('role',roleInput)
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

  async resendOtp (req:Request, res: Response):Promise<void>{
    try {
      console.log('resend otp')
      const { email }= req.body;
      if(!email){
        res.status(400).json({success: false, message: "Email is required."})
        return 
      }

      const result = await this.userService.resendOtp(email)
      res.status(200).json({success: true, message: result})

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
      res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (error:any) {
      console.log('controller error',error)
      res.status(400).json({message: error.message})
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      let roleInput;
      const {email, password, role } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required." });
        return;
        }

      if (!role && !Object.values(Role).includes(role as Role)) {
        res.status(400).json({ success: false, message: "Invalid or missing role." });
        return;       
      }

      roleInput = role as Role;
      console.log('role',roleInput)
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
      console.log('successful login')
      res.status(201).json({ success: true, message: message, data:user });
    } catch (error:any) {
        res.status(400).json({ message: error.message })
    }
  }

  async registerInstructor(req: Request, res: Response):Promise<void>{
    try {
      console.log('inside register instructor',req.body)
      const user = await this.userService.register(req.body)
      res.status(200).json({success:true, data: user})

    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
  }
}
