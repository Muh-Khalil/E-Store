import mongoose, { Document, Model, Schema } from 'mongoose'
import { IProduct } from '../types.js'

export interface IProductDocument extends Document, IProduct {}

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], required: true },
  bestSeller: { type: Boolean },
  date: { type: Number },
})

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

const productModel: Model<IProductDocument> = mongoose.models.product || mongoose.model<IProductDocument>('product', productSchema)

export default productModel
