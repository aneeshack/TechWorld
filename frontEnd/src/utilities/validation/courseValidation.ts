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

    // thumbnail: Yup.mixed<File>()
    // .required("Thumbnail is required")
    // .test("fileSize", "File size must be less than 5MB", (value: File | null) => {
    //   return value ? value.size <= 5 * 1024 * 1024 : false;
    // })
    // .test("fileType", "Only image files are allowed", (value: File | null) => {
    //     return value ? value.type.startsWith("image/") : false;
    //   }),

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
