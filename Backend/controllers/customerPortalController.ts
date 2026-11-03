import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'
import orderModel from '../models/orderModel.js'
import promotionModel from '../models/promotionModel.js'
import supportTicketModel from '../models/supportTicketModel.js'
import { Response } from 'express'
import { AuthenticatedRequest } from '../types.js'

const getUser = async (userId: string) => {
  const user = await userModel.findById(userId).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getUser(req.user!.id)
    res.json({ success: true, user })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body
    const user = await userModel.findByIdAndUpdate(req.user!.id, { name, email, phone }, { new: true }).select('-password')
    res.json({ success: true, message: 'Profile updated', user })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Current password is incorrect' })
    if (!newPassword || newPassword.length < 8) return res.json({ success: false, message: 'New password must be at least 8 characters' })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()
    res.json({ success: true, message: 'Password changed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const addAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const address = { ...req.body.address, id: Date.now().toString(), isDefault: req.body.address?.isDefault === true }
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    if (address.isDefault) user.addresses = (user.addresses || []).map((item: any) => ({ ...item, isDefault: false }))
    user.addresses = [...(user.addresses || []), address]
    await user.save()
    res.json({ success: true, message: 'Address saved', addresses: user.addresses })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    user.addresses = (user.addresses || []).filter((address: any) => address.id !== req.params.id)
    await user.save()
    res.json({ success: true, message: 'Address removed', addresses: user.addresses })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const setDefaultAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    user.addresses = (user.addresses || []).map((address: any) => ({ ...address, isDefault: address.id === req.params.id }))
    await user.save()
    res.json({ success: true, message: 'Default address updated', addresses: user.addresses })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getUser(req.user!.id)
    const products = await productModel.find({ _id: { $in: user.wishlist || [] } })
    res.json({ success: true, wishlist: user.wishlist || [], products })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const addWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.body
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    if (!(user.wishlist || []).includes(productId)) user.wishlist = [...(user.wishlist || []), productId]
    await user.save()
    res.json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const removeWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.user!.id)
    if (!user) return res.json({ success: false, message: 'User not found' })
    user.wishlist = (user.wishlist || []).filter((id: string) => id !== req.params.productId)
    await user.save()
    res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getUser(req.user!.id)
    const orders = await orderModel.find({ userId: req.user!.id }).sort({ date: -1 }).limit(5)
    const orderNotifications = orders.map((order) => ({
      id: `order-${order._id}`,
      title: 'Order update',
      message: `Your order is currently ${order.status}.`,
      type: 'Order',
      read: false,
      date: order.date,
    }))
    res.json({ success: true, notifications: [...orderNotifications, ...(user.notifications || [])] })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createSupportTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticket = new supportTicketModel({
      userId: req.user!.id,
      subject: req.body.subject,
      category: req.body.category,
      message: req.body.message,
      orderId: req.body.orderId || '',
    })
    await ticket.save()
    res.json({ success: true, message: 'Support ticket submitted', ticket })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listSupportTickets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tickets = await supportTicketModel.find({ userId: req.user!.id }).sort({ createdAt: -1 })
    res.json({ success: true, tickets })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const getRewards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getUser(req.user!.id)
    const orders = await orderModel.find({ userId: req.user!.id })
    const earnedPoints = orders.reduce((total, order) => total + Math.floor(Number(order.amount || 0) / 10), 0)
    res.json({
      success: true,
      rewards: {
        points: Number(user.rewardPoints || 0) + earnedPoints,
        referralCredits: Number(user.referralCredits || 0),
        nextRewardAt: 500,
      },
    })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const validatePromotion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, subtotal } = req.body
    const promotion = await promotionModel.findOne({ code: String(code || '').toUpperCase(), active: true })
    if (!promotion) return res.json({ success: false, message: 'Promotion code is not valid' })
    if (Number(subtotal || 0) < Number(promotion.minOrderAmount || 0)) return res.json({ success: false, message: `Minimum order amount is ${promotion.minOrderAmount}` })

    const today = new Date().toISOString().slice(0, 10)
    if (promotion.startsAt && today < promotion.startsAt) return res.json({ success: false, message: 'Promotion has not started yet' })
    if (promotion.endsAt && today > promotion.endsAt) return res.json({ success: false, message: 'Promotion has expired' })

    let discount = 0
    if (promotion.type === 'Percentage') discount = Number(subtotal || 0) * (Number(promotion.value || 0) / 100)
    if (promotion.type === 'Fixed Amount') discount = Number(promotion.value || 0)
    if (promotion.type === 'Free Shipping') discount = 10
    discount = Math.min(discount, Number(subtotal || 0))

    res.json({ success: true, message: 'Promotion applied', promotion, discount })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

export {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  listWishlist,
  addWishlist,
  removeWishlist,
  listNotifications,
  createSupportTicket,
  listSupportTickets,
  getRewards,
  validatePromotion,
}
