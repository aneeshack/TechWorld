
export interface IPayment {
	userId?: string; 
	courseId?: {
		_id:string,
		title: string
	};
	method?: string;
	status?: "pending" | "completed" | "failed" | "refunded";
	type?: "credit" | "debit";
	amount?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

