import validator from 'validator'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { sendPasswordResetEmail } from '../Config/email.js'

const createToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Request Body:', req.body)
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = createToken(String(user._id))
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    } else {
      res.json({
        success: false,
        message: 'Invalid Credentials',
      })
    }
  } catch (err) {
    console.error('Login Error:', err)
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    })
  }
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const exist = await userModel.findOne({ email })
    if (exist) {
      return res.json({ success: false, message: 'User already exist' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a valid password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    })

    const user = await newUser.save()
    const token = createToken(String(user._id))
    return res.json({ success: true, token })
  } catch (err) {
    console.log('Error ocurred')
    return res.json({ success: false, message: (err as Error).message })
  }
}

const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    console.log('Admin Login Attempt:', req.body)
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        {
          id: 'admin-id',
          isAdmin: true,
        },
        process.env.JWT_SECRET!,
      )
      console.log('Admin Login Successful, Token:', token)
      res.json({
        success: true,
        token,
        isAdmin: true,
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
  } catch (err) {
    console.error('Admin Login Error:', err)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User not found' })

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 3600000)
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
    sendPasswordResetEmail(email, user.name, resetLink).catch((err: Error) => console.log('Password reset email error:', err.message))

    res.json({ success: true, message: 'Password reset link sent to email' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
    if (!user) return res.json({ success: false, message: 'Invalid or expired token' })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ success: true, message: 'Password reset successful' })
  } catch (err) {
    res.json({ success: false, message: (err as Error).message })
  }
}

export { loginUser, adminLogin, registerUser, forgotPassword, resetPassword }
