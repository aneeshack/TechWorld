import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";

export class UserService{
    private userRepository:IUserRepository;

    constructor(userRepository:IUserRepository){
        this.userRepository = userRepository
    }

    async createUser(userData:IUser):Promise<IUser>{
        try {
            const existingUser = await this.userRepository.findByEmail(userData.email)
            if(existingUser){
                console.log('error in userService: Email already exists')
                return Promise.reject({success:false, message: "Email already exists" })
            }
            return await this.userRepository.createUser(userData)
        } catch (error) {
            console.error('Error in User Service',error)
            return Promise.reject({success:false, message: "Internal Server Error"})
        }
   
    }
}