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
        expiresAt: {
            type: Date,
            required: true,
            expires: 0, // TTL Index: MongoDB will delete expired tokens automatically
        },
    }
)
export const tokenModel = model<IToken>("tokens", tokenSchema);
