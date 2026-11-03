import mongoose, { Document, Model, Schema } from 'mongoose'
import { IInventory } from '../types.js'

export interface IInventoryDocument extends Document, IInventory {}

const inventorySchema = new Schema<IInventoryDocument>({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, required: true, default: 5 },
  location: { type: String, default: 'Main Warehouse' },
  lastMovement: { type: String, default: 'Initial stock' },
}, { timestamps: true })

const inventoryModel: Model<IInventoryDocument> = mongoose.models.inventory || mongoose.model<IInventoryDocument>('inventory', inventorySchema)

export default inventoryModel
