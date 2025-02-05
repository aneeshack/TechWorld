import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    
        password:Yup.string()
        .trim()
        .required('Password is Required')
        .min(6, 'Password must be at least 6 characters')
        .max(12, "Password can't be longer than 12 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, "Password must contain at least one number.")
        .matches(/[!@#$%^&*?]/, 'Password must contain at least one special character.'),
})