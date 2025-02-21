import express,{ Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../config/envConfig';
import cookieParser from 'cookie-parser';
import adminRouter from '../routes/adminRoutes';
import authRouter from '../routes/authRoutes';
import instructorRouter from '../routes/instructorRoutes';

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
app.use('/instructor',instructorRouter)

export default app