import mongoose, { Document, Model, Schema } from 'mongoose'
import { IReview } from '../types.js'

export interface IReviewDocument extends Document, IReview {}

const reviewSchema = new Schema<IReviewDocument>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  response: { type: String, default: '' },
}, { timestamps: true })

const reviewModel: Model<IReviewDocument> = mongoose.models.review || mongoose.model<IReviewDocument>('review', reviewSchema)

export default reviewModel
