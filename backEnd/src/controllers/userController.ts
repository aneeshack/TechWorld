import { Request, Response } from "express";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser, Role } from "../interfaces/user/IUser";
import UserModel from "../models/userModel";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";

// export class UserController {
//     constructor(
//         private userService: IUserService,
//         private userRepository: IUserRepository
//     ){}

//     async createUser(req:Request, res:Response):Promise<void>{
//         try {
//             let roleInput:Role = Role.Pending ;
//             const {userName, email, password, confirmPassword,role } = req.body;

//             if(role && Object.values(Role).includes(role as Role)){
//                roleInput = role as Role
//             }

//             console.log('body',req.body)
//             const newUser: Partial<IUser> = {
//                 userName: userName,
//                 email: email,
//                 password: password,
//                 confirmPassword: confirmPassword,
//                 role: roleInput,
//               };

//             const user = await this.userService.createUser(newUser)
//             if(!user){
//                 console.log('error in controller')
//                 throw new Error('error in controller')
//             }
//             console.log('user',user)
//             res.status(201).json({success:true,data:user})
//         } catch (error) {
//             console.log('error in creating user')
//             // throw new Error(`Error in creating user ${(error as Error).message}`)
//             res.status(400).json({ success: false, message: `${(error as Error).message}` });
//         }
//     }

// }

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new UserRepository());
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      let roleInput: Role = Role.Pending;
      const { userName, email, password, confirmPassword, role } = req.body;
      console.log('obdy',req.body)
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
}
