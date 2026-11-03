import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import inventoryModel from '../models/inventoryModel.js'
import { sendOrderConfirmation } from '../Config/email.js'
import { Response, Request } from 'express'
import { AuthenticatedRequest } from '../types.js'
import { paginate } from '../helpers.js'
import Stripe from 'stripe'

let stripeInstance: Stripe | null = null
const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not defined')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31' as any })
  }
  return stripeInstance
}
const delivery_fee = 10

const placeOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { items, amount, address } = req.body
    console.log('Place Order Request Body:', req.body)

    for (const item of items) {
      const inv = await inventoryModel.findOne({ productId: item._id })
      if (inv && inv.quantity < item.quantity) {
        return res.json({ success: false, message: `Insufficient stock for ${item.name}` })
      }
      if (inv) {
        inv.quantity -= item.quantity
        await inv.save()
      }
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    }
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, { cartData: {} })
    sendOrderConfirmation({
      orderId: String(newOrder._id),
      items,
      amount,
      address,
      paymentMethod: 'COD',
    }).catch((err: Error) => console.log('Order email error:', err.message))
    res.json({ success: true, message: 'Order Placed' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const placeOrderStripe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, amount, address } = req.body
    const newOrder = new orderModel({ userId: req.user!.id, items, amount, address, paymentMethod: "Stripe", payment: false, date: Date.now() })
    await newOrder.save()

    const line_items = items.map((item: any) => ({
      price_data: { currency: "usd", product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) },
      quantity: item.quantity
    }))
    line_items.push({
      price_data: { currency: "usd", product_data: { name: "Delivery Charges" }, unit_amount: delivery_fee * 100 },
      quantity: 1
    })

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?success=false&orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString() }
    })

    res.json({ success: true, session_url: session.url })
  } catch (err) { res.status(500).json({ success: false, message: (err as Error).message }) }
}

const verifyStripe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, success } = req.body
    if (success === "true") {
      const order = await orderModel.findById(orderId)
      if (!order) return res.status(404).json({ success: false, message: "Order not found" })
      order.payment = true
      order.status = "Processing"
      await order.save()
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} })
      sendOrderConfirmation({
        orderId: String(order._id),
        items: order.items,
        amount: order.amount,
        address: order.address,
        paymentMethod: order.paymentMethod,
      }).catch((err: Error) => console.log('Order email error:', err.message))
      res.json({ success: true })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Payment cancelled" })
    }
  } catch (err) { res.status(500).json({ success: false, message: (err as Error).message }) }
}

const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string
  let event
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) { return res.status(400).json({ success: false, message: "Webhook signature verification failed" }) }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    await orderModel.findByIdAndUpdate(session.metadata.orderId, { payment: true, status: "Processing" })
  }
  res.json({ received: true })
}

const placeOrderPayoneer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, amount, address } = req.body
    const newOrder = new orderModel({ userId: req.user!.id, items, amount, address, paymentMethod: "Payoneer", payment: false, date: Date.now() })
    await newOrder.save()
    const payoneerUrl = process.env.PAYONEER_API_URL || "https://api.sandbox.payoneer.com/v2"
    res.json({ success: true, session_url: `${payoneerUrl}/checkout?orderId=${newOrder._id}&amount=${amount}` })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const allOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit } = req.body
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [orders, total] = await Promise.all([
      orderModel.find({}).skip(skip).limit(pageLimit),
      orderModel.countDocuments({}),
    ])
    res.json({ success: true, orders, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const userOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: 'Status Updated' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.body
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    if (order.userId !== req.user!.id && !req.user?.isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' })
    if (order.status === 'Delivered' || order.status === 'Cancelled') return res.status(400).json({ success: false, message: 'Order cannot be cancelled' })
    order.status = 'Cancelled'
    await order.save()
    res.json({ success: true, message: 'Order cancelled' })
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message })
  }
}

export { placeOrder, placeOrderPayoneer, placeOrderStripe, userOrders, updateStatus, allOrders, verifyStripe, cancelOrder, stripeWebhook }
