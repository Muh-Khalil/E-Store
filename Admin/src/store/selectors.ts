import type { RootState } from "./index"

export const selectAuth = (state: RootState) => state.auth
export const selectIsAdmin = (state: RootState) => !!state.auth.token
export const selectAdminToken = (state: RootState) => state.auth.token

export const selectProducts = (state: RootState) => state.products.products
export const selectProductsLoading = (state: RootState) => state.products.loading
export const selectProductsPagination = (state: RootState) => ({ page: state.products.page, total: state.products.total, limit: state.products.limit })
export const selectEditingProduct = (state: RootState) => state.products.editingProduct

export const selectOrders = (state: RootState) => state.orders.orders
export const selectOrdersLoading = (state: RootState) => state.orders.loading
export const selectOrdersPagination = (state: RootState) => ({ page: state.orders.page, total: state.orders.total })

export const selectCustomers = (state: RootState) => state.customers.customers
export const selectCustomersLoading = (state: RootState) => state.customers.loading

export const selectInventory = (state: RootState) => state.inventory.records
export const selectInventoryLoading = (state: RootState) => state.inventory.loading

export const selectPromotions = (state: RootState) => state.growth.promotions
export const selectCampaigns = (state: RootState) => state.growth.campaigns
export const selectContentItems = (state: RootState) => state.growth.contentItems
export const selectAnalytics = (state: RootState) => state.growth.analytics
export const selectGrowthLoading = (state: RootState) => state.growth.loading
