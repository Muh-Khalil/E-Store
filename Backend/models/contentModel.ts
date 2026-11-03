import mongoose, { Document, Model, Schema } from 'mongoose'
import { IContent } from '../types.js'

export interface IContentDocument extends Document, IContent {}

const contentSchema = new Schema<IContentDocument>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Homepage Banner', 'About Us', 'FAQ', 'Terms', 'Privacy', 'Blog'], default: 'Homepage Banner' },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  body: { type: String, default: '' },
  published: { type: Boolean, default: false },
}, { timestamps: true })

const contentModel: Model<IContentDocument> = mongoose.models.content || mongoose.model<IContentDocument>('content', contentSchema)

export default contentModel
