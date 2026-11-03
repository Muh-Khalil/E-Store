import express from 'express'
import { placeOrder, placeOrderStripe, userOrders, updateStatus, allOrders, placeOrderPayoneer, verifyStripe, cancelOrder } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter: express.Router = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/payoneer', authUser, placeOrderPayoneer)

orderRouter.post('/userorders', authUser, userOrders)

orderRouter.post('/verifystripe', authUser, verifyStripe)

orderRouter.post('/cancel', authUser, cancelOrder)

export default orderRouter
