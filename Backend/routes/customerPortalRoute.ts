import express from 'express'
import authUser from '../middleware/auth.js'
import {
  addAddress,
  addWishlist,
  changePassword,
  createSupportTicket,
  deleteAddress,
  getProfile,
  getRewards,
  listNotifications,
  listSupportTickets,
  listWishlist,
  removeWishlist,
  setDefaultAddress,
  updateProfile,
  validatePromotion,
} from '../controllers/customerPortalController.js'

const customerPortalRouter: express.Router = express.Router()

customerPortalRouter.get('/profile', authUser, getProfile)
customerPortalRouter.put('/profile', authUser, updateProfile)
customerPortalRouter.put('/password', authUser, changePassword)
customerPortalRouter.post('/addresses', authUser, addAddress)
customerPortalRouter.put('/addresses/:id/default', authUser, setDefaultAddress)
customerPortalRouter.delete('/addresses/:id', authUser, deleteAddress)

customerPortalRouter.get('/wishlist', authUser, listWishlist)
customerPortalRouter.post('/wishlist', authUser, addWishlist)
customerPortalRouter.delete('/wishlist/:productId', authUser, removeWishlist)

customerPortalRouter.get('/notifications', authUser, listNotifications)
customerPortalRouter.get('/support', authUser, listSupportTickets)
customerPortalRouter.post('/support', authUser, createSupportTicket)
customerPortalRouter.get('/rewards', authUser, getRewards)
customerPortalRouter.post('/promotion/validate', authUser, validatePromotion)

export default customerPortalRouter
