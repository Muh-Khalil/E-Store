import mongoose, { Document, Model, Schema } from 'mongoose'
import { IOrderItem, IAddress } from '../types.js'

export interface IOrderDocument extends Document {
  userId: string
  items: IOrderItem[]
  amount: number
  address: IAddress
  status: string
  paymentMethod: string
  payment: boolean
  date: number
}

const orderSchema = new Schema<IOrderDocument>({
  userId: { type: String, required: true },
  items: { type: [], required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
})

const orderModel: Model<IOrderDocument> = mongoose.models.order || mongoose.model<IOrderDocument>('order', orderSchema)

export default orderModel
