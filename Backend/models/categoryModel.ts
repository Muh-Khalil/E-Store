import mongoose, { Document, Model, Schema } from 'mongoose'
import { ICategory } from '../types.js'

export interface ICategoryDocument extends Document, ICategory {}

const categorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  parent: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

const categoryModel: Model<ICategoryDocument> = mongoose.models.category || mongoose.model<ICategoryDocument>('category', categorySchema)

export default categoryModel
