import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import promotionModel from '../models/promotionModel.js'
import marketingCampaignModel from '../models/marketingCampaignModel.js'
import contentModel from '../models/contentModel.js'
import { Request, Response } from 'express'
import { paginate } from '../helpers.js'

const listPromotions = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [promotions, total] = await Promise.all([
      promotionModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      promotionModel.countDocuments({}),
    ])
    res.json({ success: true, promotions, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = new promotionModel(req.body)
    await promotion.save()
    res.json({ success: true, message: 'Promotion created', promotion })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await promotionModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Promotion updated', promotion })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deletePromotion = async (req: Request, res: Response) => {
  try {
    await promotionModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Promotion removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listMarketingCampaigns = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [campaigns, total] = await Promise.all([
      marketingCampaignModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      marketingCampaignModel.countDocuments({}),
    ])
    res.json({ success: true, campaigns, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createMarketingCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = new marketingCampaignModel(req.body)
    await campaign.save()
    res.json({ success: true, message: 'Campaign created', campaign })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateMarketingCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await marketingCampaignModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Campaign updated', campaign })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteMarketingCampaign = async (req: Request, res: Response) => {
  try {
    await marketingCampaignModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Campaign removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const listContent = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [items, total] = await Promise.all([
      contentModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      contentModel.countDocuments({}),
    ])
    res.json({ success: true, items, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const createContent = async (req: Request, res: Response) => {
  try {
    const item = new contentModel(req.body)
    await item.save()
    res.json({ success: true, message: 'Content created', item })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateContent = async (req: Request, res: Response) => {
  try {
    const item = await contentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Content updated', item })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteContent = async (req: Request, res: Response) => {
  try {
    await contentModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Content removed' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const analyticsSummary = async (req: Request, res: Response) => {
  try {
    const [orders, products, users] = await Promise.all([
      orderModel.find({}),
      productModel.find({}),
      userModel.find({}).select('-password'),
    ])

    const revenue = orders.reduce((total, order) => total + Number(order.amount || 0), 0)
    const paidOrders = orders.filter((order) => order.payment)
    const averageOrderValue = orders.length ? revenue / orders.length : 0
    const statusCounts = orders.reduce((counts: Record<string, number>, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1
      return counts
    }, {})

    const productPerformance: Record<string, { name: string; quantity: number; revenue: number }> = {}
    orders.forEach((order) => {
      ;(order.items || []).forEach((item: any) => {
        const key = item._id || item.name
        if (!productPerformance[key]) {
          productPerformance[key] = {
            name: item.name || 'Product',
            quantity: 0,
            revenue: 0,
          }
        }
        const quantity = Number(item.quantity || 1)
        productPerformance[key].quantity += quantity
        productPerformance[key].revenue += Number(item.price || 0) * quantity
      })
    })

    const topProducts = Object.values(productPerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const recentOrders = orders
      .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
      .slice(0, 6)
      .map((order) => ({
        _id: order._id,
        amount: order.amount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        date: order.date,
      }))

    res.json({
      success: true,
      summary: {
        revenue,
        orders: orders.length,
        paidOrders: paidOrders.length,
        averageOrderValue,
        products: products.length,
        customers: users.length,
        conversionRate: users.length ? (orders.length / users.length) * 100 : 0,
      },
      statusCounts,
      topProducts,
      recentOrders,
    })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

export {
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  listMarketingCampaigns,
  createMarketingCampaign,
  updateMarketingCampaign,
  deleteMarketingCampaign,
  listContent,
  createContent,
  updateContent,
  deleteContent,
  analyticsSummary,
}
