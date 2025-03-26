import { IUser, RequestStatus } from "../interfaces/database/IUser";
import { IAuthRepository } from "../interfaces/user/IAuthRepository";
import OtpModel from "../models/otpModel";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class AuthRepository implements IAuthRepository {

  async findById(userId: mongoose.Types.ObjectId):Promise<IUser |null> {
    return await UserModel.findById(userId)
  }

  
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email});
    } catch (error) {
      console.error("authRepository error:finbyemail", error);
      throw new Error(`Error in finding Email: ${(error as Error).message}`);
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      console.error("authRepository error:createUser", error);
      throw new Error(`Error in creating user: ${(error as Error).message}`);
    }
  }

  async updateUser(
    email: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {

      const user = await UserModel.findOneAndUpdate(
        { email },
        { $set: updateData },
        {new: true}
      );

      if (!user) {
        throw new Error("User update failed. No user found.");
      }
      return user;
    } catch (error) {
      console.error("authRepository error:updateUser", error);
      throw new Error(`Error in updating user: ${(error as Error).message}`);
    }
  }

  async createOtp(otpData: { email: string; otp: string }): Promise<void> {
    try {
      const otp = new OtpModel(otpData);
      await otp.save();
    } catch (error) {
      console.error("authRepository error:create otp", error);
      throw new Error(`Error in creating otp: ${(error as Error).message}`);
    }
  }

  async findOtpByEmail(
    email: string
  ): Promise<{ email: string; otp: string } | null> {
    try {
      return await OtpModel.findOne({ email });
    } catch (error) {
      console.error("authRepository error: find otp by email", error);
      throw new Error(
        `Error in finding otp by email: ${(error as Error).message}`
      );
    }
  }

  async deleteOtp(email: string): Promise<void> {
    try {
      const otp =await OtpModel.deleteOne({ email });
    } catch (error) {
      console.error("authRepository error: delete otp", error);
      throw new Error(`Error in deleting otp: ${(error as Error).message}`);
    }
  }

  async verifyUser(email: string, password: string): Promise<IUser> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("user not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      if (!user.isOtpVerified) {
        throw new Error("OTP not verified. Signup again");
      }

      return user;
    } catch (error) {
      console.error("authRepository error: verify user", error);
      throw new Error(` ${(error as Error).message}`);
    }
  }

  async updateRegister(userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const updateInstructor = await UserModel.findByIdAndUpdate(
        userData._id,
        { $set: userData, isRequested: true, requestStatus: RequestStatus.Pending },{new: true},
      );

      if(!updateInstructor){
        throw new Error('Failed to update instructor')
      }

      const user = await UserModel.findById(userData._id)
      return user;
    } catch (error) {
      console.error("authRepository error: register instructor", error);
      throw new Error(` ${(error as Error).message}`);
    }
  }

  async updatePassword(userId: string, password:string):Promise<void>{
    try {
      await UserModel.updateOne({ _id: userId }, { $set: { password } });
    } catch (error) {
      console.error("authRepository error: reset password", error);
      throw new Error(` ${(error as Error).message}`);
    }
  }
}




// import { Model } from "mongoose";
// import bcrypt from "bcrypt";
// import mongoose from "mongoose";
// import { IAuthRepository } from "../interfaces/user/IAuthRepository";
// import { IUser, RequestStatus } from "../interfaces/database/IUser";
// import { GenericRepository } from "./genericRepository";
// import UserModel from "../models/userModel";
// import OtpModel, { IOtp } from "../models/otpModel";

// export class AuthRepository implements IAuthRepository {
//   private _userRepository: GenericRepository<IUser>;
//   private _otpRepository: GenericRepository<IOtp>;

//   constructor(
//     userModel: Model<IUser> = UserModel,
//     otpModel: Model<IOtp> = OtpModel  ) {
//     this._userRepository = new GenericRepository<IUser>(userModel);
//     this._otpRepository = new GenericRepository<IOtp>(otpModel);
//   }

//   async findById(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
//     try {
//       return await this._userRepository.findById(userId.toString());
//     } catch (error) {
//       console.log("authRepository error: findById", error);
//       throw new Error(`Error finding user by ID: ${(error as Error).message}`);
//     }
//   }

//   async findByEmail(email: string): Promise<IUser | null> {
//     try {
//       return await this._userRepository.findOne({ email });
//     } catch (error) {
//       console.log("authRepository error: findByEmail", error);
//       throw new Error(`Error finding email: ${(error as Error).message}`);
//     }
//   }

//   async createUser(userData: Partial<IUser>): Promise<IUser> {
//     try {
//       return await this._userRepository.create(userData);
//     } catch (error) {
//       console.log("authRepository error: createUser", error);
//       throw new Error(`Error creating user: ${(error as Error).message}`);
//     }
//   }

//   async updateUser(email: string, updateData: Partial<IUser>): Promise<IUser | null> {
//     try {
//       const user = await UserModel.findOneAndUpdate(
//         { email },
//         { $set: updateData },
//         { new: true }
//       );
//       if (!user) {
//         throw new Error("User update failed. No user found.");
//       }
//       console.log("user in repository", user);
//       return user;
//     } catch (error) {
//       console.log("authRepository error: updateUser", error);
//       throw new Error(`Error updating user: ${(error as Error).message}`);
//     }
//   }

//   async createOtp(otpData: { email: string; otp: string }): Promise<void> {
//     try {
//       await this._otpRepository.create(otpData);
//     } catch (error) {
//       console.log("authRepository error: createOtp", error);
//       throw new Error(`Error creating OTP: ${(error as Error).message}`);
//     }
//   }

//   async findOtpByEmail(email: string): Promise<{ email: string; otp: string } | null> {
//     try {
//       return await this._otpRepository.findOne({ email });
//     } catch (error) {
//       console.log("authRepository error: findOtpByEmail", error);
//       throw new Error(`Error finding OTP by email: ${(error as Error).message}`);
//     }
//   }

//   async deleteOtp(email: string): Promise<void> {
//     try {
//       await OtpModel.deleteOne({ email }); // Raw Mongoose since GenericRepository lacks delete
//     } catch (error) {
//       console.log("authRepository error: deleteOtp", error);
//       throw new Error(`Error deleting OTP: ${(error as Error).message}`);
//     }
//   }

//   async verifyUser(email: string, password: string): Promise<IUser> {
//     try {
//       const user = await this._userRepository.findOne({ email });
//       if (!user) {
//         throw new Error("User not found");
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         throw new Error("Invalid credentials");
//       }

//       if (!user.isOtpVerified) {
//         throw new Error("OTP not verified. Signup again");
//       }

//       return user;
//     } catch (error) {
//       console.log("authRepository error: verifyUser", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }

//   async updateRegister(userData: Partial<IUser>): Promise<IUser | null> {
//     try {
//       const updateInstructor = await this._userRepository.update(userData._id as string, {
//         ...userData,
//         isRequested: true,
//         requestStatus: RequestStatus.Pending,
//       });
//       if (!updateInstructor) {
//         throw new Error("Failed to update instructor");
//       }
//       console.log("register", updateInstructor);
//       return updateInstructor;
//     } catch (error) {
//       console.log("authRepository error: updateRegister", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }

//   async updatePassword(userId: string, password: string): Promise<void> {
//     try {
//       await this._userRepository.update(userId, { password });
//     } catch (error) {
//       console.log("authRepository error: updatePassword", error);
//       throw new Error(` ${(error as Error).message}`);
//     }
//   }
// }