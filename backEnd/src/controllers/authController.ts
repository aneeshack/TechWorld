import { Request, Response } from "express";
import { IUser, Role } from "../interfaces/database/IUser";
import { clearTokenCookie, setTokenCookie } from "../util/auth/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";
import { IAuthService } from "../interfaces/user/IAuthService";

export class AuthController {

  constructor(private _authService: IAuthService) {}

  async fetchUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        return;
      }

      const user = await this._authService.getUserById(req.user.id);

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

      const userData: Partial<IUser> = {
        userName,
        email,
        password,
        confirmPassword,
        role: roleInput,
        isOtpVerified: false,
      };

      const result = await this._authService.signup(userData);
      res.status(201).json({ success: true, message: result.message });
    } catch (error:any) {
        res.status(400).json({ success: false, message: error.message })
    }
  }

  async resendOtp (req:Request, res: Response):Promise<void>{
    try {
      const { email }= req.body;
      if(!email){
        res.status(400).json({success: false, message: "Email is required."})
        return 
      }

      const result = await this._authService.resendOtp(email)
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

      const { message, token, user} = await this._authService.verifyOtp(email,otp)
      if(!token){
        throw new Error('token not generated')
      }

      setTokenCookie(res, token)
      res.status(200).json({success:true, message, data:user})

    } catch (error:any) {
      console.error('controller error',error)
      res.status(400).json({success: false, message: error.message})
    }
  }


  async logout(req: Request, res: Response):Promise<void>{
    try {
      console.log('inside loggout')
      clearTokenCookie(res)
      res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (error:any) {
      console.error('controller error',error)
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
      const userData: Partial<IUser> = {
        email,
        password,
        role: roleInput,
      };

      const { message, user, token} = await this._authService.loginAction(userData);
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
      console.error('error',error.message)
        res.status(400).json({ success:false, message: error.message })
    }
  }

  async googleAuthentication(req: Request, res: Response):Promise<void>{
    try {
      let roleInput;
      const { credentials, userRole } = req.body;

      if (!userRole && !Object.values(Role).includes(userRole as Role)) {
        res.status(400).json({ success: false, message: "Invalid or missing role." });
        return;       
      }

      roleInput = userRole as Role;
      const { message, user, token} = await this._authService.googleAuth(credentials,roleInput)

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
      const user = await this._authService.register(req.body)
      res.status(200).json({success:true, data: user})

    } catch (error: any) {
        res.status(400).json({success: false, message: error.message })
    }
  }

  async forgotPassword(req:Request, res:Response):Promise<void>{
    try {
      const {email,role}= req.body
      if (!role && !Object.values(Role).includes(role as Role)) {
        res.status(400).json({ success: false, message: "Invalid or missing role." });
        return;       
      }
      const user = await this._authService.forgotPassword(email, role)
      res.status(200).json({success:true, message:'Otp send to your, email plase verify it.'})
    } catch (error:any) {
      res.status(400).json({ success:false, message: error.message })
    }
  }

  async resetPassword(req:Request, res: Response):Promise<void>{
    try {
      const{email, role, password} = req.body

      if (!email || !role || !password) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
      }
      const result =await this._authService.resetPassword(email, password,role)
      res.status(200).json({success:true, message: result.message})
    } catch (error:any) {
      res.status(400).json({ success:false, message: error.message })
    }
  }

  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(400).json({ success: false, message: 'Email and OTP are required' });
        return;
      }

      const { message } = await this._authService.verifyForgotPasswordOtp(email, otp);
      res.status(200).json({ success: true, message });
    } catch (error: any) {
      console.error('controller error: verifyForgotPasswordOtp', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  
}
