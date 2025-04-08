import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { envConfig } from '../config/envConfig';
import adminRouter from '../routes/adminRoutes';
import authRouter from '../routes/authRoutes';
import instructorRouter from '../routes/instructorRoutes';
import userRouter from '../routes/userRoutes';
import studentRouter from '../routes/studentRoutes';
import { initializeSocket } from './socket';
import chatRouter from '../routes/chatRoutes';
import morgan from "morgan";
import { errorHandler } from '../middlewares/errorMiddleware';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

const app = express();
const server = createServer(app);
app.use(helmet()); 


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later.",
// });

// app.use(limiter);

const io = new Server(server, {
  cors: {
    origin: envConfig.http.ORIGIN || '*', 
    methods: ['GET', 'POST'],
    credentials: true, 
  },
});

initializeSocket(io);

// Morgan middleware for logging requests
app.use(morgan("dev"));


const corsOptions = {
  origin: envConfig.http.ORIGIN,
  methods: 'GET, HEAD, PUT, POST, PATCH, DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Other middleware and routes
app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/instructor', instructorRouter);
app.use('/student', studentRouter);
app.use('/chats', chatRouter);

app.use(errorHandler)

export { app, server };

