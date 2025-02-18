import * as Yup from 'yup';

export const categoryValidationSchema = Yup.object({
    categoryName: Yup.string()
    .trim()
    .required('category name is required')
    .min(3, 'category name must be at least 3 characters'),

    description: Yup.string()
    .trim()
    .required('category description is required')
    .min(10, 'category description must be at least 10 characters'),

    // imageUrl: Yup.string()
    // .trim()
    // .required("Category thumbnail is required")
    // .url("Invalid image url"),
  
})