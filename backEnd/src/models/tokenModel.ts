import { Document, model, Schema } from "mongoose";

interface IToken extends Document{
    token: string,
    userId: string
}
const tokenSchema = new Schema(
	{
        userId:{
            type: String,

        },
        token: {
			type: String,
            unique: true
		},
    }
)
export const tokenModel = model<IToken>("tokens", tokenSchema);
