import { IUser, Role } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { OtpGenerator } from "../util/auth/generateOtp";
import { generateToken } from "../util/auth/jwt";
import EmailService from "../util/auth/nodeMailer";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export class UserService {
    constructor(private userRepository: UserRepository){}

    async getUserById(userId: string): Promise<IUser |null>{
        return this.userRepository.findById(userId)
    }

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

    async resendOtp(email: string):Promise<{message: string}>{
        try {
            const user = await this.userRepository.findByEmail(email)
            if(!user){
                 throw new Error('user not found')
            }
            await this.userRepository.deleteOtp(email)
             
             // generate and save otp
            const otp = OtpGenerator.generateOtp()
            console.log('otp',otp)
            await this.userRepository.createOtp({email, otp})

            const emailService = new EmailService()
            await emailService.sendMail(email, "otp verification", otp)

            return {message: "Signup successful. Please verify your email."}
        } catch (error) {
            console.log('userService error:resend Otp',error)
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

    async googleAuth(credentials: any, roleInput:Role):Promise<IUser |null>{
        try {
            console.log("Received credentials:", credentials); 

            if (!credentials || !credentials.credential) {
                throw new Error("No credentials received.");
            }
    
            // Decode the JWT token
            const decoded = jwt.decode(credentials.credential);
    
            if (!decoded || typeof decoded !== 'object') {
                throw new Error("Invalid token. Decoding failed.");
            }
    
            // Extract values from the decoded token
            const { email, name, picture, sub: googleId } = decoded as any;
    
            console.log("Decoded Token -> Name:", name, "Email:", email, "Google ID:", googleId);
    
            if (!googleId) {
                throw new Error("Google ID (sub) is missing in credentials.");
            }


            let user = await this.userRepository.findByEmail(email);

            if(user && user?.role !==roleInput ){
                throw new Error(`you signed in as ${user?.role}. Please use the ${user?.role} login page`)
            }

            if(!user){
                user = await this.userRepository.createUser({
                    email,
                    userName:name,
                    isGoogleAuth:true,
                    role: roleInput,
                    isOtpVerified: false,
                    profile: {
                        avatar: picture
                    }
                })
            }else{
                const updateData: Partial<IUser> = {}

                if(!user.isGoogleAuth){
                    updateData.isGoogleAuth = true
                }
                if(!user.profile?.avatar){
                    updateData.profile = {... (user.profile || {}), avatar: picture}
                }

                if(!user.userName){
                    updateData.userName = name
                }

                if(Object.keys(updateData).length>0){
                    user = await this.userRepository.updateUser(email, updateData)
                }
            }

            const token = generateToken({id:user?._id,email, role:user?.role})
           
            if(!token){
                throw new Error('token not generated')
            }

            return user;
        } catch (error) {
            console.log('userService error:google signup',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async forgotPassword(email: string, role:Role):Promise<{message: string}>{
        try {
            const user = await this.userRepository.findByEmail(email)
            if(!user){
                throw new Error('User not found. Please signup again')
            }

            if(user.role === Role.Admin || user.role !==role){
                throw new Error('Unauthorized access')
            }

            
            if(user.isGoogleAuth){
                throw new Error('Please login through google or signup')
            }

            await this.userRepository.deleteOtp(email)
            // generate and save otp
            const otp = OtpGenerator.generateOtp()
            console.log('otp',otp)

            await this.userRepository.createOtp({email, otp})

            const emailService = new EmailService()
            await emailService.sendMail(email, "otp verification", otp)

            return {message: "Signup successful. Please verify your email."}

        } catch (error) {
            console.log('userService error:forgot password',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async resetPassword(email: string, password: string, role:Role):Promise<{message: string}>{
        try {
            console.log('inside reset password')
            const user = await this.userRepository.findByEmail(email)
            if (!user) {
                throw new Error("User not found");
              }

            if(user.role !== role){
                throw new Error('role is not matching')
            }
            
            const hashedPassword = await bcrypt.hash(password, 10); // Hashing password
            await this.userRepository.updatePassword(user?._id as string, hashedPassword);

            return {message: 'password reset successfully'}
        } catch (error) {
            console.log('userService error:reset password',error)
            throw new Error(`${(error as Error).message}`)
        }
    }
}