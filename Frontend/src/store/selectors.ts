import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./index"

export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token
export const selectToken = (state: RootState) => state.auth.token

export const selectProducts = (state: RootState) => state.products.products
export const selectProductsLoading = (state: RootState) => state.products.loading
export const selectProductFilters = (state: RootState) => state.products.filters
export const selectShowSearch = (state: RootState) => state.products.showSearch

export const selectFilteredProducts = createSelector(
  [selectProducts, selectProductFilters],
  (products, filters) => {
    let result = [...products]
    if (filters.category) result = result.filter(p => p.category === filters.category)
    if (filters.subCategory) result = result.filter(p => p.subCategory === filters.subCategory)
    if (filters.search) result = result.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()))
    if (filters.sort === "low-high") result.sort((a, b) => a.price - b.price)
    if (filters.sort === "high-low") result.sort((a, b) => b.price - a.price)
    return result
  }
)

export const selectBestSellers = createSelector([selectProducts], products =>
  products.filter(p => p.bestSeller)
)

export const selectLatestProducts = createSelector([selectProducts], products =>
  products.slice(0, 10)
)

export const selectRelatedProducts = createSelector(
  [selectProducts, (_, category: string) => category, (_, __: string, subCategory: string) => subCategory],
  (products, category, subCategory) =>
    products.filter(p => p.category === category && p.subCategory === subCategory).slice(0, 5)
)

export const selectCartItems = (state: RootState) => state.cart.items
export const selectDeliveryFee = (state: RootState) => state.cart.deliveryFee
export const selectCurrency = (state: RootState) => state.cart.currency
export const selectDiscount = (state: RootState) => state.cart.discount

export const selectCartCount = createSelector([selectCartItems], items => {
  return Object.values(items).reduce((count, sizes) =>
    count + Object.values(sizes).reduce((sum, qty) => sum + qty, 0), 0
  )
})

export const selectCartSubtotal = createSelector([selectCartItems, selectProducts], (items, products) => {
  let total = 0
  for (const [itemId, sizes] of Object.entries(items)) {
    const product = products.find(p => p._id === itemId)
    if (product) {
      for (const qty of Object.values(sizes)) total += product.price * qty
    }
  }
  return total
})

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectDeliveryFee, (state: RootState) => state.cart.discount?.discount || 0],
  (subtotal, deliveryFee, discount) => Math.max(0, subtotal + (subtotal > 0 ? deliveryFee : 0) - discount)
)

export const selectOrders = (state: RootState) => state.orders.orders
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder

export const selectProfile = (state: RootState) => state.customer.profile
export const selectAddresses = (state: RootState) => state.customer.addresses
export const selectWishlist = (state: RootState) => state.customer.wishlist
export const selectNotifications = (state: RootState) => state.customer.notifications
export const selectRewards = (state: RootState) => state.customer.rewards

export const selectPaymentConfig = (state: RootState) => state.payment.config
export const selectPaymentMethods = createSelector([selectPaymentConfig], config => config?.methods || [])
