import userModel from '../models/userModel.js'
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types.js'

const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { itemId, size } = req.body
    console.log('Received userId:', userId)
    const userData = await userModel.findById(userId)
    if (!userData) return res.json({ success: false, message: 'User not found' })
    let cartData = await userData.cartData

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }

    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Added To Cart' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { itemId, size, quantity } = req.body

    const userData = await userModel.findById(userId)
    if (!userData) return res.json({ success: false, message: 'User not found' })
    let cartData = await userData.cartData

    cartData[itemId][size] = quantity
    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Cart Updated' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const getUserCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id

    const userData = await userModel.findById(userId)
    if (!userData) return res.json({ success: false, message: 'User not found' })
    let cartData = await userData.cartData

    res.json({ success: true, cartData })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

export { addToCart, updateCart, getUserCart }
