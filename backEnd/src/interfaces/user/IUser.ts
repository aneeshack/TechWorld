import { Document } from "mongoose";

interface Profile{
    avatar?: string |File,
    dateOfBirth?: string,
    gender?: string,
    profileDescription?: string
}

export enum RequestStatus{
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected'
}

interface Contact{
    phoneNumber?: string,
    social?: string,
    address?: Address,
}

interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
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


export interface IUser extends Document{
    email: string,
    password: string,
    confirmPassword?: string,
    userName?: string,
    profile?: Profile,
    contact?: Contact,
    profession?: Profession,
    qualification?: string,
    cv?: string,
    role?: Role,
    profit?: string,
    isGoogleAuth?: boolean,
    requestStatus?: RequestStatus,
    isRequested?: boolean,
    isOtpVerified?: boolean,
    isBlocked?: boolean,
    lastLoginDate?: Date,
    loginStreak?: number,
    createdAt?: Date,
    updatedAt?: Date,
    experience?: Number
}