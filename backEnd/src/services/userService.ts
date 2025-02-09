import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { OtpGenerator } from "../util/auth/generateOtp";
import { generateToken } from "../util/auth/jwt";
import EmailService from "../util/auth/nodeMailer";
import bcrypt from 'bcrypt'

export class UserService {
    // constructor(private userRepository: IUserRepository){}
    constructor(private userRepository: UserRepository){}

    async signup(userData: Partial<IUser>): Promise<{ message: string }>{
        try {
            if (!userData.email || !userData.password) {
                throw new Error('Email and password is required');
            }
            
            const existingUser = await this.userRepository.findByEmail(userData.email)
            if(existingUser){
                throw new Error('User already exists')
            }

            userData.password = await bcrypt.hash(userData.password, 10)
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
            throw new Error(`${(error as Error).message}`)
        }
    }

    async verifyOtp(email: string, otp: string):Promise<{message:string, token?:string, user?:Partial<IUser>}>{
        try {
            const foundOtp = await this.userRepository.findOtpByEmail(email)
            if(!foundOtp){
                 throw new Error('Otp expired')
            }
            
            if(foundOtp.otp !==otp){
                throw new Error('Invalid Otp')
            }
           
            const user = await this.userRepository.updateUser(email,{ isOtpVerified:true})
            if(!user){
                throw new Error('Failed to update user')
            }
            const token = generateToken({id:user?._id,email, role:user?.role})

            await this.userRepository.deleteOtp(email)

            return {message:'user signup successfull', token, user}
        } catch (error) {
            console.log('userService error:verify Otp',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async loginAction(userData: Partial<IUser>): Promise<{ message: string, user?:Partial<IUser>, token?: string }>{
        try {
            if (!userData.email || !userData.password) {
                throw new Error('Email is required');
            }
            
            const user = await this.userRepository.verifyUser(userData.email, userData?.password)
            if(!user){
                throw new Error('Invalid credentials')
            }

            if(userData.role !==user.role){
                throw new Error('Invalid credentials')
            }
            const token = generateToken({id:user?._id,email:user?.email, role:user?.role})


            return {message: "Login successful.", user: user,token}
        } catch (error) {
            console.log('userService error:login',error)
            throw new Error(`${(error as Error).message}`)
        }
    }
    
    async register(userData: Partial<IUser>):Promise<{message: string, user?:Partial<IUser>}>{
        try {
            const user = await this.userRepository.updateRegister(userData)
            if(!user){
                throw new Error('can not find user')
            }
            return {message:'success', user}
        } catch (error) {
            console.log('userService error:signup',error)
            throw new Error(`${(error as Error).message}`)
        }
    }
}