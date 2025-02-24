export const env = {
    BACKEND_API_URL : import.meta.env.VITE_BACKEND_API_URL,
    CLOUD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
    STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
}