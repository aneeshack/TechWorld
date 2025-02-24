import * as Yup from "yup";

export const lessonValidationSchema = Yup.object({
    
    title: Yup.string()
    .trim()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),

    thumbnail: Yup.string()
    .trim()
    .required("Profile picture is required")
    .url("Invalid image url"),
 
    pdf: Yup.string()
    .nullable()
    .required('pdf is required')
    .url("Invalid cv url"),
    
    description: Yup.string()
    .trim()
    .required("description is required")
    .min(10, "description must be at least 2 characters"),

    // video: Yup.string()
    // .trim()
    // .nullable()
    // .required("Video is required").url("Invalid video url"),

});
