import { Document, model, Model, Schema } from "mongoose";

export const userSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	role: {
		type: String,
	},
});

export interface IUser extends Document {
	name: string;
	email: string;
	role: string;
}

export const User: Model<IUser> = model<IUser>("User", userSchema);
