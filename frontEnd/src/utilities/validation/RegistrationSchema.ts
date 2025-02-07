import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .required("full name is required")
    .min(2, "Full name must be at least 2 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Full name should contain only letters and spaces"
    ),

  contact: Yup.object().shape({
    phoneNumber: Yup.string()
      .trim()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits."),
  }),

  profile: Yup.object().shape({
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Enter valid date of birth"),
    profileDescription: Yup.string()
      .trim()
      .min(10, "short bio must be at least 10 characters"),
    avatar: Yup.string()
      .trim()
      .required("Profile picture is required")
      .url("Invalid image url"),
  }),

  cv: Yup.string().nullable().required("CV is required").url("Invalid cv url"),

  experience: Yup.number()
    .required("Years of experience is required")
    .min(0, "Experience caanot be negative")
    .max(50, "Experience seems too high, please enter a valid number"),

  qualification: Yup.string()
    .trim()
    .required("qualification is required")
    .min(2, "Qualification must be at least 2 characters"),
});
