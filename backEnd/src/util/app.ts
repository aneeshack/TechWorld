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


// const stripe = new Stripe(envConfig.stripe.STRIPE_SECRET_KEY ||'*', { apiVersion: '2025-01-27.acacia' });
// Webhook endpoint must use raw body parsing (before express.json())
// app.use('/webhook/stripe', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   const webhookSecret = envConfig.stripe.STRIPE_WEBHOOK_SECRET;

//   try {
//     // Verify the event came from Stripe
//     const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

//     // Handle the checkout.session.completed event
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const { userId, courseId } = session.metadata;

//       // Check if payment already exists (idempotency)
//       const existingPayment = await paymentModel.findOne({ userId, courseId });
//       if (!existingPayment) {
//         // Save payment to paymentModel
//         await paymentModel.create({
//           userId,
//           courseId,
//           amount: session?.amount_total / 100, // Convert from cents to INR
//           status: 'completed',
//           stripeSessionId: session.id,
//           completedAt: new Date(),
//         });
//       }
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error('Webhook error:', error);
//     res.status(400).send(`Webhook Error: ${(error as Error).message}`);
//   }
// });