import { Document } from "mongoose";

interface Profile{
    avatar?: string |File,
    dateOfBirth?: string,
    gender?: string
}

interface Contact{
    phone?: string,
    social?: string,
    address?: string,
}

enum Profession{
    Student = 'student',
    Working = 'working'
}

export enum Role{
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
    Pending ='pending'
}


export interface IUser  extends Document{
    email: string,
    password: string,
    confirmPassword?: string,
    userName?: string,
    profile?: Profile,
    contact?: Contact,
    profession?: Profession,
    qualification?: string,
    role?: Role,
    profit?: string,
    isGoogleAuth?: boolean,
    isRejected?: boolean,
    isRequested?: boolean,
    isOtpVerified?: boolean,
    isBlocked?: boolean,
    lastLoginDate?: Date,
    loginStreak?: number,
    createdAt?: Date,
    updatedAt?: Date
}