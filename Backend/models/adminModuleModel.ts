import mongoose, { Document, Model, Schema } from 'mongoose'
import { IAdminModule } from '../types.js'

export interface IAdminModuleDocument extends Document, IAdminModule {}

const adminModuleSchema = new Schema<IAdminModuleDocument>({
  module: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'Open' },
  metadata: { type: Object, default: {} },
}, { timestamps: true, minimize: false })

const adminModuleModel: Model<IAdminModuleDocument> = mongoose.models.adminModule || mongoose.model<IAdminModuleDocument>('adminModule', adminModuleSchema)

export default adminModuleModel
