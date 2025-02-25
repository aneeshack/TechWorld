import Stripe from "stripe";
import { IPayment } from "../interfaces/courses/IPayment";
import { paymentModel } from "../models/paymentModel";

export class PaymentRepository {
   private stripe: Stripe;  // Define Stripe as a property
 
   constructor() {
     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
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
      const session = await this.stripe.checkout.sessions.create({
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
              unit_amount: amount * 100, // Stripe expects amount in cents/paise
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?courseId=${courseId}`,
        metadata: {
          userId,
          courseId,
        },
      });
      return session;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      throw new Error("Stripe session creation failed.");
    }
  }

  async getSession(sessionId: string) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      throw new Error("Stripe session retrieval failed.");
    }
  }

  async paymentCompletion(paymentData: any):Promise<IPayment>{
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
