import { IUser } from "./IUser";

export interface IUserRepository {
    createUser(userData: Partial<IUser>) :Promise<IUser>;
    findByEmail(email: string) : Promise<IUser | null>;
}