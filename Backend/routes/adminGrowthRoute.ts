import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import {
  analyticsSummary,
  createContent,
  createMarketingCampaign,
  createPromotion,
  deleteContent,
  deleteMarketingCampaign,
  deletePromotion,
  listContent,
  listMarketingCampaigns,
  listPromotions,
  updateContent,
  updateMarketingCampaign,
  updatePromotion,
} from '../controllers/adminGrowthController.js'

const adminGrowthRouter: express.Router = express.Router()

adminGrowthRouter.get('/promotions', adminAuth, listPromotions)
adminGrowthRouter.post('/promotions', adminAuth, createPromotion)
adminGrowthRouter.put('/promotions/:id', adminAuth, updatePromotion)
adminGrowthRouter.delete('/promotions/:id', adminAuth, deletePromotion)

adminGrowthRouter.get('/marketing', adminAuth, listMarketingCampaigns)
adminGrowthRouter.post('/marketing', adminAuth, createMarketingCampaign)
adminGrowthRouter.put('/marketing/:id', adminAuth, updateMarketingCampaign)
adminGrowthRouter.delete('/marketing/:id', adminAuth, deleteMarketingCampaign)

adminGrowthRouter.get('/content', adminAuth, listContent)
adminGrowthRouter.post('/content', adminAuth, createContent)
adminGrowthRouter.put('/content/:id', adminAuth, updateContent)
adminGrowthRouter.delete('/content/:id', adminAuth, deleteContent)

adminGrowthRouter.get('/analytics', adminAuth, analyticsSummary)

export default adminGrowthRouter
