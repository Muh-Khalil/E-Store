import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import mongoose from "mongoose"
import type { Db } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

if (mongoose.connection.readyState !== 1) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }
  await mongoose.connect(process.env.MONGODB_URI)
}

const db = mongoose.connection.db as unknown as Db
if (!db) {
  throw new Error("MongoDB database instance is not initialized")
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    usePlural: true
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 4000}`,
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174'
  ],
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string" },
      phone: { type: "string" },
      addresses: { type: "string" },
      wishlist: { type: "string" },
      cartData: { type: "string" },
    }
  }
})
