"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const stripe_1 = __importDefault(require("stripe"));
const paymentModel_1 = require("../models/paymentModel");
class PaymentRepository {
    constructor() {
        this._stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-01-27.acacia",
        });
    }
    createCheckoutSession(userId, courseId, amount, courseName, courseThumbnail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield paymentModel_1.paymentModel.findOne({ userId, courseId });
                if (payment) {
                    throw new Error('Payment for this course has already been completed');
                }
                const session = yield this._stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    // customer_email: `${userId}@example.com`, // Use actual email
                    line_items: [
                        {
                            price_data: {
                                currency: "INR",
                                product_data: {
                                    name: courseName,
                                    images: [courseThumbnail],
                                },
                                unit_amount: amount * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.FRONTEND_URL}/checkout/${courseId}`,
                    metadata: {
                        userId,
                        courseId,
                    },
                });
                return session;
            }
            catch (error) {
                console.error("Error creating Stripe session:", error);
                throw new Error(`Stripe session creation failed: ${error.message}`);
            }
        });
    }
    getSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._stripe.checkout.sessions.retrieve(sessionId);
            }
            catch (error) {
                console.error("Error retrieving Stripe session:", error);
                throw new Error("Stripe session retrieval failed.");
            }
        });
    }
    paymentCompletion(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = new paymentModel_1.paymentModel(paymentData);
                yield payment.save();
                if (!payment) {
                    throw new Error('Error in updating payment');
                }
                return payment;
            }
            catch (error) {
                console.error("Error in payment updation:", error);
                throw new Error("Stripe session retrieval failed.");
            }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
