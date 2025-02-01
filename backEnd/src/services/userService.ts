import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { OtpGenerator } from "../util/otp/generateOtp";
import EmailService from "../util/otp/nodeMailer";

// export class UserService{
//     private userRepository:IUserRepository;

//     constructor(userRepository:IUserRepository){
//         this.userRepository = userRepository
//     }

//     async createUser(userData:IUser):Promise<IUser>{
//         try {
//             const existingUser = await this.userRepository.findByEmail(userData.email)
//             if(existingUser){
//                 console.log('error in userService: Email already exists')
//                 return Promise.reject({success:false, message: "Email already exists" })
//             }
//             return await this.userRepository.createUser(userData)
//         } catch (error) {
//             console.error('Error in User Service',error)
//             return Promise.reject({success:false, message: "Internal Server Error"})
//         }
   
//     }
// }

export class UserService {
    constructor(private userRepository: UserRepository){}

    async signup(userData: Partial<IUser>): Promise<{ message: string }>{
        try {
            if (!userData.email) {
                throw new Error('Email is required');
            }
            
            const existingUser = await this.userRepository.findByEmail(userData.email)
            if(existingUser){
                throw new Error('User already exists')
            }

            await this.userRepository.createUser({...userData, isOtpVerified: false})

            // generate and save otp
            const otp = OtpGenerator.generateOtp()
            console.log('otp',otp)
            await this.userRepository.createOtp({email: userData.email, otp})

            const emailService = new EmailService()
            await emailService.sendMail(userData.email, "otp verification", otp)

            return {message: "Signup successful. Please verify your email."}
        } catch (error) {
            console.log('userService error:signup',error)
            throw new Error(`Error in signup: ${(error as Error).message}`)
        }
    }
}