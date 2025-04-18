import { Request, Response } from "express";
import { IUser, Role } from "../interfaces/database/IUser";
import { clearTokenCookie, setTokenCookie } from "../util/auth/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";
import { IAuthService } from "../interfaces/user/IAuthService";
import { throwError } from "../middlewares/errorMiddleware";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../interfaces/types";
import { HTTP_STATUS } from "../constants/httpStatus";

@injectable()
export class AuthController {

  constructor(@inject(AUTH_TYPES.AuthService) private _authService: IAuthService) {}

  
  async fetchUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        return throwError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: No user ID found");
      }

      const user = await this._authService.getUserById(req.user.id);

      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {

      const { userName, email, password, confirmPassword, role } = req.body;
      
      if (!email || !password) {
        return throwError(HTTP_STATUS.BAD_REQUEST, "Email and password are required.");
        }

        if (!role && !Object.values(Role).includes(role as Role)) {
          return throwError(HTTP_STATUS.BAD_REQUEST, "Invalid or missing role.");     
        }

        const roleInput = role as Role;

      const userData: Partial<IUser> = {
        userName,
        email,
        password,
        confirmPassword,
        role: roleInput,
        isOtpVerified: false,
      };

      const result = await this._authService.signup(userData);
      res.status(HTTP_STATUS.CREATED).json({ success: true, message: result.message });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async resendOtp (req:Request, res: Response):Promise<void>{
    try {
      const { email }= req.body;
      if(!email){
        return throwError(HTTP_STATUS.BAD_REQUEST, "Email is required.");
      }

      const result = await this._authService.resendOtp(email)
      res.status(HTTP_STATUS.OK).json({success: true, message: result})

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async verifyOtp(req:Request, res: Response):Promise<void>{
    try {
      const { email, otp} = req.body

      if(!email || !otp){
        return throwError(HTTP_STATUS.BAD_REQUEST, "Email and otp are required.");
      }

      const { message, token, user} = await this._authService.verifyOtp(email,otp)
      if(!token){
        return throwError(500, "token not generated.");
      }

      setTokenCookie(res, token)
      res.status(HTTP_STATUS.OK).json({success:true, message, data:user})

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }


  async logout(req: Request, res: Response):Promise<void>{
    try {
      clearTokenCookie(res)
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Logged out successfully' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // let roleInput;
      const {email, password, role } = req.body;

      if (!email || !password) {
        return throwError(400, "Email and password are required.");
        }

      if (!role && !Object.values(Role).includes(role as Role)) {
        return throwError(400, "Invalid or missing role");      
      }

      const roleInput = role as Role;
      const userData: Partial<IUser> = {
        email,
        password,
        role: roleInput,
      };

      const { message, user, token} = await this._authService.loginAction(userData);
      if(user?.isBlocked){
        throwError(HTTP_STATUS.FORBIDDEN, "Admin blocked you. Please contact admin.");
      }
      
      if(!token){
        return throwError(500, "token required.");
      }

      setTokenCookie(res, token)
      console.log('successful login')
      res.status(201).json({ success: true, message: message, data:user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async googleAuthentication(req: Request, res: Response):Promise<void>{
    try {
      const { credentials, userRole } = req.body;

      if (!userRole && !Object.values(Role).includes(userRole as Role)) {
        return throwError(HTTP_STATUS.BAD_REQUEST, "Invalid or missing role.");     
      }

      const roleInput = userRole as Role;
      const { message, user, token} = await this._authService.googleAuth(credentials,roleInput)

      if(!token){
        return throwError(500, "token is not provided.");
    }

     setTokenCookie(res, token)
      res.status(HTTP_STATUS.OK).json({success:true, message:message, data: user})

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async registerInstructor(req: Request, res: Response):Promise<void>{
    try {
      const user = await this._authService.register(req.body)
      console.log('user',user)
      res.status(HTTP_STATUS.OK).json({success:true, data: user})

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async forgotPassword(req:Request, res:Response):Promise<void>{
    try {
      const {email,role}= req.body
      if (!role && !Object.values(Role).includes(role as Role)) {
        return throwError(HTTP_STATUS.BAD_REQUEST, "Invalid or missing role.");     
      }
      const user = await this._authService.forgotPassword(email, role)
      res.status(HTTP_STATUS.OK).json({success:true, message:'Otp send to your, email plase verify it.', data:user})
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async resetPassword(req:Request, res: Response):Promise<void>{
    try {
      const{email, role, password} = req.body

      if (!email || !role || !password) {
        return throwError(HTTP_STATUS.BAD_REQUEST, "All fields are required");     
      }
      const result =await this._authService.resetPassword(email, password,role)
      res.status(HTTP_STATUS.OK).json({success:true, message: result.message})
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return throwError(HTTP_STATUS.BAD_REQUEST, "All fields are required"); 
      }

      const { message } = await this._authService.verifyForgotPasswordOtp(email, otp);
      res.status(HTTP_STATUS.OK).json({ success: true, message });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  
}
