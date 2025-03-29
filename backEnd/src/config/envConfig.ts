import dotenv from 'dotenv'
dotenv.config();


export const envConfig ={
    http:{
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        ORIGIN: process.env.FRONTEND_URL
    },
    mongo: {
        MONGODB_URI : process.env.MONGODB_URI
    },
    stripe: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
    }
}
