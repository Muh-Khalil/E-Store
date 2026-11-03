import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import {
  createCategory,
  createReview,
  deleteCategory,
  deleteInventory,
  deleteReview,
  listCategories,
  listCustomers,
  listInventory,
  listReviews,
  updateCategory,
  updateReview,
  upsertInventory,
} from '../controllers/adminStoreController.js'

const adminStoreRouter: express.Router = express.Router()

adminStoreRouter.get('/customers', adminAuth, listCustomers)

adminStoreRouter.get('/inventory', adminAuth, listInventory)
adminStoreRouter.post('/inventory', adminAuth, upsertInventory)
adminStoreRouter.delete('/inventory/:id', adminAuth, deleteInventory)

adminStoreRouter.get('/categories', adminAuth, listCategories)
adminStoreRouter.post('/categories', adminAuth, createCategory)
adminStoreRouter.put('/categories/:id', adminAuth, updateCategory)
adminStoreRouter.delete('/categories/:id', adminAuth, deleteCategory)

adminStoreRouter.get('/reviews', adminAuth, listReviews)
adminStoreRouter.post('/reviews', adminAuth, createReview)
adminStoreRouter.put('/reviews/:id', adminAuth, updateReview)
adminStoreRouter.delete('/reviews/:id', adminAuth, deleteReview)

export default adminStoreRouter
