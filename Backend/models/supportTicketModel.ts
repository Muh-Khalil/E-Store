import mongoose, { Document, Model, Schema } from 'mongoose'
import { ISupportTicket } from '../types.js'

export interface ISupportTicketDocument extends Document, ISupportTicket {}

const supportTicketSchema = new Schema<ISupportTicketDocument>({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, enum: ['General', 'Order', 'Payment', 'Technical'], default: 'General' },
  message: { type: String, required: true },
  orderId: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'In Progress', 'Waiting on Customer', 'Resolved', 'Closed'], default: 'Open' },
  response: { type: String, default: '' },
}, { timestamps: true })

const supportTicketModel: Model<ISupportTicketDocument> = mongoose.models.supportTicket || mongoose.model<ISupportTicketDocument>('supportTicket', supportTicketSchema)

export default supportTicketModel
