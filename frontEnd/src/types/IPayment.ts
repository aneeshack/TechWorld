
export interface IPayment {
	_id:string,
	userId?: {
		_id:string,
		userName: string,
		email: string
	}; 
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

