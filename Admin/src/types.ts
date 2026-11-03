export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  subCategory: string
  bestSeller: boolean
  sizes: string[]
  image: string[]
  date: number
}

export interface OrderItem {
  name: string
  quantity: number
  size: string
}

export interface Address {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  country: string
  zipcode: string
  phone: string
}

export interface Order {
  _id: string
  items: OrderItem[]
  address: Address
  paymentMethod: string
  payment: boolean
  date: string
  amount: number
  status: string
}

export interface Category {
  _id: string
  name: string
  description: string
  image: string
  parent: string
  active: boolean
}

export interface Customer {
  _id: string
  name: string
  email: string
  orderCount: number
  lifetimeValue: number
  lastOrderDate?: string
}

export interface Review {
  _id: string
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  status: 'Pending' | 'Approved' | 'Rejected'
  response?: string
}

export interface InventoryItem {
  _id: string
  productId: string
  productName: string
  quantity: number
  lowStockThreshold: number
  location: string
  lastMovement: string
}

export interface Promotion {
  _id: string
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

export interface MarketingCampaign {
  _id: string
  name: string
  channel: string
  audience: string
  budget: number
  status: string
  scheduledAt: string
  message: string
}

export interface ContentItem {
  _id: string
  title: string
  type: string
  slug: string
  image: string
  body: string
  published: boolean
}

export interface AdminModule {
  _id: string
  title: string
  description: string
  status: string
  metadata: Record<string, unknown>
}

export interface AnalyticsData {
  summary: {
    revenue: number
    orders: number
    averageOrderValue: number
    conversionRate: number
    paidOrders: number
    products: number
    customers: number
  }
  statusCounts: Record<string, number>
  topProducts: Array<{ name: string; quantity: number; revenue: number }>
  recentOrders: Array<{
    _id: string
    amount: number
    paymentMethod: string
    date: string
    status: string
  }>
}

export interface ProductFormData {
  name: string
  description: string
  price: string | number
  category: string
  subCategory: string
  bestSeller: boolean
  sizes: string[]
  images: (File | false)[]
}

export interface ProductFormProps {
  initialProduct?: Product
  submitLabel: string
  loading: boolean
  onSubmit: (data: ProductFormData) => void
}

export interface SidebarNavItem {
  to: string
  label: string
  icon?: string
  iconText?: string
}

export interface SidebarNavGroup {
  label: string
  items: SidebarNavItem[]
}

export interface CategoryForm {
  name: string
  description: string
  image: string
  parent: string
  active: boolean
}

export interface ContentForm {
  title: string
  type: string
  slug: string
  image: string
  body: string
  published: boolean
}

export interface PromotionForm {
  code: string
  title: string
  type: string
  value: string
  minOrderAmount: string
  startsAt: string
  endsAt: string
  description: string
  active: boolean
}

export interface MarketingForm {
  name: string
  channel: string
  audience: string
  budget: string
  status: string
  scheduledAt: string
  message: string
}

export interface ReviewForm {
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  status: string
  response: string
}

export interface InventoryForm {
  productId: string
  quantity: string
  lowStockThreshold: string
  location: string
  lastMovement: string
}

export interface PaginationInfo {
  page: number
  totalPages: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
