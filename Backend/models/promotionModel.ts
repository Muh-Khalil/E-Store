import mongoose, { Document, Model, Schema } from 'mongoose'
import { IPromotion } from '../types.js'

export interface IPromotionDocument extends Document, IPromotion {}

const promotionSchema = new Schema<IPromotionDocument>({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Percentage', 'Fixed', 'Free Shipping'], default: 'Percentage' },
  value: { type: Number, required: true, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  startsAt: { type: String, default: '' },
  endsAt: { type: String, default: '' },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

const promotionModel: Model<IPromotionDocument> = mongoose.models.promotion || mongoose.model<IPromotionDocument>('promotion', promotionSchema)

export default promotionModel
