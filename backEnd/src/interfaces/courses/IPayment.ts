import mongoose from "mongoose";

export interface IPayment extends Document {
	userId?: mongoose.Types.ObjectId; 
	courseId: mongoose.Types.ObjectId;
	method: string;
	status: "pending" | "completed" | "failed" | "refunded";
	type: "credit" | "debit";
	amount: number;
	createdAt?: Date;
	updatedAt?: Date;
}

