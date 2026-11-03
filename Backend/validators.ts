import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub-category is required')
})

export const orderSchema = z.object({
  items: z.array(z.any()).min(1, 'At least one item is required'),
  amount: z.number().positive('Amount must be a positive number'),
  address: z.object({}).passthrough()
})

export const promotionSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  value: z.number().positive('Value must be a positive number')
})
