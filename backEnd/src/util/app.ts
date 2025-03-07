import express,{ Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../config/envConfig';
import cookieParser from 'cookie-parser';
import adminRouter from '../routes/adminRoutes';
import authRouter from '../routes/authRoutes';
import instructorRouter from '../routes/instructorRoutes';
import userRouter from '../routes/userRoutes';
import studentRouter from '../routes/studentRoutes';

const app = express()


const corsOptions ={
    origin: envConfig.http.ORIGIN,
    methods: 'GET, HEAD, PUT, POST, PATCH, DELETE',
    credentials:true,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/',authRouter)
app.use('/admin',adminRouter)
app.use('/user',userRouter)
app.use('/instructor',instructorRouter)
app.use('/student',studentRouter)

export default app