import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import inventoryModel from '../models/inventoryModel.js'
import categoryModel from '../models/categoryModel.js'
import reviewModel from '../models/reviewModel.js'
import { Request, Response } from 'express'
import { paginate } from '../helpers.js'

const listCustomers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [users, orders, total] = await Promise.all([
      userModel.find({}).select('-password').skip(skip).limit(pageLimit),
      orderModel.find({}),
      userModel.countDocuments({}),
    ])

    const customers = users.map((user) => {
      const userOrders = orders
        .filter((order) => order.userId === String(user._id))
        .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
      const lifetimeValue = userOrders.reduce((total, order) => total + Number(order.amount || 0), 0)
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        orderCount: userOrders.length,
        lifetimeValue,
        lastOrderDate: userOrders[0]?.date || null,
      }
    })

    res.json({ success: true, customers, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listInventory = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [records, total] = await Promise.all([
      inventoryModel.find({}).sort({ updatedAt: -1 }).skip(skip).limit(pageLimit),
      inventoryModel.countDocuments({}),
    ])
    res.json({ success: true, records, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const upsertInventory = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, lowStockThreshold, location, lastMovement } = req.body
    const product = await productModel.findById(productId)
    if (!product) return res.json({ success: false, message: 'Product not found' })

    const record = await inventoryModel.findOneAndUpdate(
      { productId },
      {
        productId,
        productName: product.name,
        quantity: Number(quantity),
        lowStockThreshold: Number(lowStockThreshold),
        location,
        lastMovement,
      },
      { new: true, upsert: true }
    )

    res.json({ success: true, message: 'Inventory saved', record })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteInventory = async (req: Request, res: Response) => {
  try {
    await inventoryModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Inventory removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [categories, total] = await Promise.all([
      categoryModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      categoryModel.countDocuments({}),
    ])
    res.json({ success: true, categories, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new categoryModel(req.body)
    await category.save()
    res.json({ success: true, message: 'Category created', category })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Category updated', category })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Category removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [reviews, total] = await Promise.all([
      reviewModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      reviewModel.countDocuments({}),
    ])
    res.json({ success: true, reviews, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createReview = async (req: Request, res: Response) => {
  try {
    const review = new reviewModel(req.body)
    await review.save()
    res.json({ success: true, message: 'Review created', review })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Review updated', review })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteReview = async (req: Request, res: Response) => {
  try {
    await reviewModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Review removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

export {
  listCustomers,
  listInventory,
  upsertInventory,
  deleteInventory,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listReviews,
  createReview,
  updateReview,
  deleteReview,
}
