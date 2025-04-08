import Stripe from "stripe";
import { IPayment } from "../interfaces/courses/IPayment";
import { paymentModel } from "../models/paymentModel";
import { payment } from "../services/userService";

export class PaymentRepository {
   private _stripe: Stripe; 
 
   constructor() {
     this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
       apiVersion: "2025-01-27.acacia",
     });
   }

   async createCheckoutSession(
    userId: string,
    courseId: string,
    amount: number,
    courseName: string,
    courseThumbnail: string
  ) {
    try {
      const payment = await paymentModel.findOne({userId,courseId})
      if(payment){
        throw new Error('Payment for this course has already been completed')
      }
      const session = await this._stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
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
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      throw new Error(`Stripe session creation failed: ${(error as Error).message}`);
    }
  }

  async getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this._stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      throw new Error("Stripe session retrieval failed.");
    }
  }

  async paymentCompletion(paymentData: payment):Promise<IPayment>{
    try {
      const payment = new paymentModel(paymentData);
      await payment.save()
      if(!payment){
        throw new Error('Error in updating payment')
      }
      return payment
    } catch (error) {
      console.error("Error in payment updation:", error);
      throw new Error("Stripe session retrieval failed.");
    }
  }

}
