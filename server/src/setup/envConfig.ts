import dotenv from 'dotenv'
import { mongo } from 'mongoose';
dotenv.config();


export const envConfig ={
    mongo: {
        MONGODB_URI : process.env.MONGODB_URI
    }
}
