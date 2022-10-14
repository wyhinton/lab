import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/IUser';

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

export default mongoose.model<IUser>('UserModel', UserSchema);
