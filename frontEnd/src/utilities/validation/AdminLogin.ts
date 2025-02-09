import * as Yup from 'yup';

export const adminLoginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    
        password:Yup.string()
        .trim()
        .required('Password is Required')
        .min(6, 'Password must be at least 6 characters')
       
})