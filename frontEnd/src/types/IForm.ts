interface Profile{
    avatar?: string | File | null,
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

export interface LoginFormData{
    email: string,
    password: string
}

export interface SignupFormData {
    _id?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    userName?: string,
    profile?: Profile,
    contact?: Contact,
    profession?: Profession,
    qualification?: string,
    role?: Role,
    cv?: string |null,
    profit?: string,
    isGooleAuth?: boolean,
    requestStatus?: RequestStatus,
    isRequested?: boolean,
    isOtpVerified?: boolean,
    isBlocked?: boolean,
    lastLoginDate?: Date,
    loginStreak?: number,
    weeklyLogins?: boolean[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface Response{
    success: boolean,
    message?: string,
    data?: SignupFormData
}