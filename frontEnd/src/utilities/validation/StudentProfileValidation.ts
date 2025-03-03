import { useState, ChangeEvent } from 'react';
import { SignupFormData } from '../../types/IForm'

interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = (initialData: Partial<SignupFormData>) => {
  const [formData, setFormData] = useState<Partial<SignupFormData>>(initialData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.userName || formData.userName.length < 3) {
      errors.userName = 'Username is required and must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.qualification || formData.qualification.length < 5) {
      errors.qualification = 'Qualification is required and must be at least 5 characters';
    }

    if (formData.profile?.dateOfBirth) {
      const dob = new Date(formData.profile.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        errors['profile.dateOfBirth'] = 'Date of birth cannot be in the future';
      }
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (formData.contact?.phoneNumber && !phoneRegex.test(formData.contact.phoneNumber)) {
      errors['contact.phoneNumber'] = 'Please enter a valid phone number (e.g., +1234567890)';
    }

    if (formData.contact?.address?.city && formData.contact.address.city.length < 2) {
      errors['contact.address.city'] = 'City must be at least 2 characters if provided';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      profile: { ...prev.profile, [name]: value },
      contact: { ...prev.contact, [name]: value },
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return { formData, setFormData, formErrors, handleInputChange, validateForm };
};