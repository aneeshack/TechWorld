import express,{ Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../config/envConfig';
import cookieParser from 'cookie-parser';
import userRouter from '../routes/userRoutes';
import adminRouter from '../routes/adminRoutes';

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


app.use('/',userRouter)
app.use('/admin',adminRouter)

export default app