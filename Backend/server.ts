import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './Config/mongodb.js'
import connectCloudinary from './Config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import dotenv from 'dotenv'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import adminModuleRouter from './routes/adminModuleRoute.js'
import adminStoreRouter from './routes/adminStoreRoute.js'
import adminGrowthRouter from './routes/adminGrowthRoute.js'
import customerPortalRouter from './routes/customerPortalRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./auth.js"
import { stripeWebhook } from './controllers/orderController.js'
import { authLimiter, generalLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174']

app.use(helmet())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(generalLimiter)

app.all("/api/auth/*", toNodeHandler(auth))
app.post("/api/order/stripe-webhook", express.raw({ type: "application/json" }), stripeWebhook)

app.use(express.json())
app.use('/api/user', authLimiter, userRouter)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin-module', adminModuleRouter)
app.use('/api/admin-store', adminStoreRouter)
app.use('/api/admin-growth', adminGrowthRouter)
app.use('/api/customer', customerPortalRouter)
app.use('/api/payment', paymentRouter)

connectDB()
connectCloudinary()

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('API Working')
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(port, () => console.log('Server is Running on PORT:' + port))
