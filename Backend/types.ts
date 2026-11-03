import { Request } from 'express'

export interface IUser {
  name: string
  email: string
  password: string
  role?: string
  cartData: Record<string, Record<string, number>>
  phone: string
  addresses: IAddress[]
  wishlist: string[]
  notifications: Notification[]
  rewardPoints: number
  referralCredits: number
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

export interface IProduct {
  name: string
  slug?: string
  description: string
  price: number
  image: string[]
  category: string
  subCategory: string
  sizes: string[]
  bestSeller: boolean
  date: number
}

export interface IOrderItem {
  _id?: string
  name: string
  price: number
  quantity: number
  size?: string
}

export interface IAddress {
  id: string
  firstName?: string
  lastName?: string
  street?: string
  city?: string
  state?: string
  country?: string
  zipcode?: string
  phone?: string
  email?: string
  isDefault?: boolean
}

export interface ICartData {
  [itemId: string]: {
    [size: string]: number
  }
}

export interface ICategory {
  name: string
  slug?: string
  description: string
  image: string
  parent: string
  active: boolean
}

export interface IInventory {
  productId: string
  productName: string
  quantity: number
  lowStockThreshold: number
  location: string
  lastMovement: string
}

export interface IReview {
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  status: string
  response: string
}

export interface IPromotion {
  code: string
  title: string
  type: string
  value: number
  minOrderAmount: number
  startsAt: string
  endsAt: string
  description: string
  active: boolean
}

export interface IMarketingCampaign {
  name: string
  channel: string
  audience: string
  budget: number
  status: string
  scheduledAt: string
  message: string
}

export interface ISupportTicket {
  userId: string
  subject: string
  category: string
  message: string
  orderId: string
  status: string
  response: string
}

export interface IContent {
  title: string
  type: string
  slug: string
  image: string
  body: string
  published: boolean
}

export interface IAdminModule {
  module: string
  title: string
  description: string
  status: string
  metadata: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface AnalyticsSummary {
  revenue: number
  orders: number
  paidOrders: number
  averageOrderValue: number
  products: number
  customers: number
  conversionRate: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  date: number
}

export interface Rewards {
  points: number
  referralCredits: number
  nextRewardAt: number
}

export interface JwtPayload {
  id: string
  isAdmin?: boolean
}

export interface AuthRequest extends Request {
  headers: Request['headers'] & { token?: string }
  user?: { id: string; isAdmin?: boolean }
}

export interface AuthenticatedRequest extends AuthRequest {
  body: AuthRequest['body'] & { userId?: string }
}

export interface EnvConfig {
  PORT: number
  MONGODB_URI: string
  JWT_SECRET: string
  CLOUDINARY_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_SECRET_KEY: string
  ADMIN_EMAIL: string
  ADMIN_PASSWORD: string
  SMTP_SERVER: string
  SMTP_PORT: number
  EMAIL_USER: string
  EMAIL_PASS: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  PAYONEER_API_URL: string
}

export interface PaymentMethod {
  id: string
  name: string
  enabled: boolean
}

export interface PaymentConfig {
  success: boolean
  methods: PaymentMethod[]
  stripePublishableKey: string | null
}
