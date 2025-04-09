import * as Yup from "yup";

export const courseValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),

  description: Yup.string()
    .trim()
    .required("description is required")
    .min(10, "description must be at least 10 characters"),

    thumbnail: Yup.string()
    .required("Thumbnail URL is required")
    .url("Invalid image URL"),    

  category: Yup.string()
    .trim()
    .required("category is required"),

  price: Yup.number()
    .required("Price is required")
    .min(1000, "Price can't be below Rs:1000")
   
});
