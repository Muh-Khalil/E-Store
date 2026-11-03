import express from 'express'
import { loginUser, adminLogin, registerUser, forgotPassword, resetPassword } from '../controllers/userControllers.js'

const userRouter: express.Router = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter
