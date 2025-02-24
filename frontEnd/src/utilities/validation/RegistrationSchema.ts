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

    address: Yup.object().shape({
      street: Yup.string()
        .trim()
        .required("Street is required")
        .min(2, "Street name is too short")
        .matches(
          /^[A-Za-z\s]+$/,
          "street name should contain only letters and spaces"
        ),

      city: Yup.string()
        .trim()
        .required("City is required")
        .min(2, "City name is too short")
        .matches(
          /^[A-Za-z\s]+$/,
          "city name should contain only letters and spaces"
        ),

      state: Yup.string()
        .trim()
        .required("State is required")
        .min(2, "State name is too short")
        .matches(
          /^[A-Za-z\s]+$/,
          "state name should contain only letters and spaces"
        ),

      country: Yup.string()
        .trim()
        .required("Country is required")
        .min(2, "Country name is too short")
        .matches(
          /^[A-Za-z\s]+$/,
          "country name should contain only letters and spaces"
        ),

      pinCode: Yup.string()
        .trim()
        .required("Zip code is required")
        .matches(/^\d{6}$/, "Zip code must be  6 digits"),
    }),
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
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female", "other"], "Invalid gender selection"),
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
