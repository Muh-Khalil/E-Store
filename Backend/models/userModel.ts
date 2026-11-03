import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from '../types.js'

export interface IUserDocument extends Document, IUser {}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  cartData: { type: Object, default: {} },
  phone: { type: String, default: '' },
  addresses: { type: [], default: [] },
  wishlist: { type: [String], default: [] },
  notifications: { type: [], default: [] },
  rewardPoints: { type: Number, default: 0 },
  referralCredits: { type: Number, default: 0 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { minimize: false })

const userModel: Model<IUserDocument> = mongoose.models.user || mongoose.model<IUserDocument>('user', userSchema)

export default userModel
