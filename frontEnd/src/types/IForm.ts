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
    profit?: string,
    isGooleAuth?: boolean,
    isRejected?: boolean,
    isRequested?: boolean,
    isOtpVerified?: boolean,
    isBlocked?: boolean,
    lastLoginDate?: Date,
    loginStreak?: number,
    weeklyLogins?: boolean[]
}

export interface Response{
    success: boolean,
    message?: string,
    data?: SignupFormData
}