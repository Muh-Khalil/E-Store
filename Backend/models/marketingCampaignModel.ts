import mongoose, { Document, Model, Schema } from 'mongoose'
import { IMarketingCampaign } from '../types.js'

export interface IMarketingCampaignDocument extends Document, IMarketingCampaign {}

const marketingCampaignSchema = new Schema<IMarketingCampaignDocument>({
  name: { type: String, required: true },
  channel: { type: String, required: true, enum: ['Email', 'SMS', 'Push', 'Social'], default: 'Email' },
  audience: { type: String, default: 'All customers' },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Scheduled', 'Sending', 'Sent', 'Cancelled'], default: 'Draft' },
  scheduledAt: { type: String, default: '' },
  message: { type: String, default: '' },
}, { timestamps: true })

const marketingCampaignModel: Model<IMarketingCampaignDocument> = mongoose.models.marketingCampaign || mongoose.model<IMarketingCampaignDocument>('marketingCampaign', marketingCampaignSchema)

export default marketingCampaignModel
