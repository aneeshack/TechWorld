import Stripe from "stripe";

export class PaymentRepository {
   private stripe: Stripe;  // Define Stripe as a property
 
   constructor() {
     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
       apiVersion: "2025-01-27.acacia",
     });
   }

  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      payment_method_types: ["card"],
    });
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status;
  }
}
