import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { ICourse } from "../interfaces/courses/ICourse";
import { InstructorRepository } from "../repository/instructorRepository";

export class InstructorService {
    constructor(private instructorRepository: InstructorRepository){}

    async getCategories():Promise<CategoryEntity[]>{
        try {
            const categories = await this.instructorRepository.fetchCategories();
            if(!categories){
                throw new Error('No categories found')
            }
            return categories
        } catch (error) {
            console.log('instructorService error:get all categories',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async createCourse(courseData: Partial<ICourse>):Promise<ICourse | null>{
        try {
            const course = await this.instructorRepository.addCourse(courseData)

            if(!course){
                throw new Error('No course found')
            }
            return course;
        } catch (error) {
            console.log('instructorService error: create course',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async updateCourse(courseId:string, courseData: Partial<ICourse>):Promise<ICourse | null>{
        try {
            const course = await this.instructorRepository.editCourse(courseId, courseData)

            if(!course){
                throw new Error('No course found')
            }
            return course;
        } catch (error) {
            console.log('instructorService error: update course',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async fetchAllCourses(instructorId:mongoose.Types.ObjectId):Promise<ICourse[] | null>{
        try {
            const courses = await this.instructorRepository.getAllCoursesByInstructor(instructorId)

            if(!courses){
                throw new Error('No courses found')
            }
            return courses;
        } catch (error) {
            console.log('instructorService error: update courses',error)
            throw new Error(`${(error as Error).message}`)
        }
    }

    async fetchCourse(courseId: string):Promise<ICourse | null>{
        try {
            return await this.instructorRepository.getSingleCourse(courseId)

        } catch (error) {
            console.log('instructorService error: fetch course',error)
            throw new Error(`${(error as Error).message}`)
        }
    }
}