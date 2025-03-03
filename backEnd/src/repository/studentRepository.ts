import mongoose from "mongoose";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/user/IUser";
import UserModel from "../models/userModel";

export class StudentRepository implements IStudentRepository{

    async getStudentProfile(userId: string): Promise<IUser | null> {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            console.error("Error fetching student profile:", error);
            throw new Error("Failed to fetch student profile");
        }
    }

    async updateStudent(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
            return UserModel.findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(userId), role: 'student' },
              { $set: updateData },
              { new: true } // Return the updated document
            ).exec();
        } catch (error) {
            console.error("Error updating student profile:", error);
            throw new Error("Failed to update student profile");
        }
    }
}