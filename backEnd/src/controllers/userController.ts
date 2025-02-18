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
        res.status(400).json({ success: false, message: error.message })
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
      res.status(400).json({success: false, message: error.message })
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
      res.status(400).json({success: false, message: error.message})
    }
  }


  async logout(req: Request, res: Response):Promise<void>{
    try {
      console.log('inside loggout')
      clearTokenCookie(res)
      res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (error:any) {
      console.log('controller error',error)
      res.status(400).json({success: false, message: error.message})
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
      if(user?.isBlocked){
        throw new Error('admin blocked you. Please contact admin.')
      }
      
      if(!token){
        throw new Error('token not generated')
      }

      setTokenCookie(res, token)
      console.log('successful login')
      res.status(201).json({ success: true, message: message, data:user });
    } catch (error:any) {
        res.status(400).json({ success:false, message: error.message })
    }
  }

  async googleAuthentication(req: Request, res: Response):Promise<void>{
    try {
      console.log('inside google authentication',req.body)

      let roleInput;
      const { credentials, userRole } = req.body;

      if (!userRole && !Object.values(Role).includes(userRole as Role)) {
        res.status(400).json({ success: false, message: "Invalid or missing role." });
        return;       
      }

      roleInput = userRole as Role;
      console.log('role',userRole)
      // const user = await this.userService.googleAuth(credentials,roleInput)
      const { message, user, token} = await this.userService.googleAuth(credentials,roleInput)

      if(!token){
        throw new Error('token not generated')
    }

     setTokenCookie(res, token)
      res.status(200).json({success:true, message:message, data: user})

    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message })
    }
  }

  async registerInstructor(req: Request, res: Response):Promise<void>{
    try {
      console.log('inside register instructor',req.body)
      const user = await this.userService.register(req.body)
      res.status(200).json({success:true, data: user})

    } catch (error: any) {
        res.status(400).json({success: false, message: error.message })
    }
  }

  async forgotPassword(req:Request, res:Response):Promise<void>{
    try {
      console.log('forgot password')
      const {email,role}= req.body
        console.log(email,role)
      if (!role && !Object.values(Role).includes(role as Role)) {
        res.status(400).json({ success: false, message: "Invalid or missing role." });
        return;       
      }
      const user = await this.userService.forgotPassword(email, role)
      res.status(200).json({success:true, message:'Otp send to your, email plase verify it.'})
    } catch (error:any) {
      res.status(400).json({ success:false, message: error.message })
    }
  }

  async resetPassword(req:Request, res: Response):Promise<void>{
    try {
      const{email, role, password} = req.body
      console.log('req.body',req.body)

      if (!email || !role || !password) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
      }
      const result =await this.userService.resetPassword(email, password,role)
      res.status(200).json({success:true, message: result.message})
    } catch (error:any) {
      res.status(400).json({ success:false, message: error.message })
    }
  }
  
}
