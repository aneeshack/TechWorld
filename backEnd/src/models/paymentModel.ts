import { Schema, model } from "mongoose";
import { IPayment } from "../interfaces/courses/IPayment";

const paymentSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
            ref: "users",
			required: true,
		},
		courseId: {
			type: Schema.Types.ObjectId,
            ref:'courses',
			required: true,
		},
		method: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed", "refunded"],
			required: true,
		},
		type:{
			type: String,
			enum: ["credit", "debit"],
			required: false,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const paymentModel = model<IPayment>("payments", paymentSchema);