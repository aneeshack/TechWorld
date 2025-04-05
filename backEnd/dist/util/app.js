"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const envConfig_1 = require("../config/envConfig");
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const instructorRoutes_1 = __importDefault(require("../routes/instructorRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const studentRoutes_1 = __importDefault(require("../routes/studentRoutes"));
const socket_1 = require("./socket");
const chatRoutes_1 = __importDefault(require("../routes/chatRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const helmet_1 = __importDefault(require("helmet"));
// import rateLimit from 'express-rate-limit';
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
app.use((0, helmet_1.default)());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: envConfig_1.envConfig.http.ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
(0, socket_1.initializeSocket)(io);
// Morgan middleware for logging requests
app.use((0, morgan_1.default)("dev"));
const corsOptions = {
    origin: envConfig_1.envConfig.http.ORIGIN,
    methods: 'GET, HEAD, PUT, POST, PATCH, DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Other middleware and routes
app.use('/', authRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.use('/instructor', instructorRoutes_1.default);
app.use('/student', studentRoutes_1.default);
app.use('/chats', chatRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
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
