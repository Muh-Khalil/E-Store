import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { auth } from '../auth.js'

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('DB Connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  await mongoose.connect(`${process.env.MONGODB_URI}`)

  // Seed Admin User
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_password'

    const adminExists = await userModel.findOne({ email: adminEmail })
    const db = mongoose.connection.db
    const accountExists = adminExists && db ? await db.collection('accounts').findOne({ userId: String(adminExists._id) }) : null

    if (!adminExists || !accountExists) {
      console.log('Seeding Admin User in Database via Better Auth...')
      
      // If user exists but account does not, delete the user to allow clean creation
      if (adminExists) {
        await userModel.deleteOne({ email: adminEmail })
      }

      // Create user using Better Auth
      const userResult = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: 'Admin',
          role: 'admin',
        }
      })

      // Update the user document to ensure it has all legacy/extra fields with the correct types
      if (userResult && userResult.user) {
        await userModel.updateOne(
          { email: adminEmail },
          {
            $set: {
              role: 'admin',
              cartData: {},
              addresses: [],
              wishlist: [],
              notifications: [],
              rewardPoints: 0,
              referralCredits: 0
            }
          }
        )
      }
      console.log('Admin User Seeded Successfully!')
    }
  } catch (err) {
    console.error('Error seeding admin user:', err)
  }
}

export default connectDB
