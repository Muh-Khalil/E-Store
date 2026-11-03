import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Address, Reward, Notification, SupportTicket, User } from "../types"
import type { RootState } from "./index"

interface CustomerState {
  profile: User | null
  addresses: Address[]
  wishlist: string[]
  notifications: Notification[]
  supportTickets: SupportTicket[]
  rewards: Reward | null
  loading: boolean
  error: string | null
}

const initialState: CustomerState = {
  profile: null,
  addresses: [],
  wishlist: [],
  notifications: [],
  supportTickets: [],
  rewards: null,
  loading: false,
  error: null,
}

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

export const fetchProfile = createAsyncThunk("customer/fetchProfile", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.get(`${getBackendUrl()}/api/customer/profile`, { headers: { token } })
  if (response.data.success) return response.data.user as User
  throw new Error(response.data.message)
})

export const updateProfile = createAsyncThunk(
  "customer/updateProfile",
  async (profile: Partial<User>, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.put(`${getBackendUrl()}/api/customer/profile`, profile, { headers: { token } })
    if (response.data.success) return response.data.user as User
    throw new Error(response.data.message)
  }
)

export const changePassword = createAsyncThunk(
  "customer/changePassword",
  async (passwords: { currentPassword: string; newPassword: string }, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.put(`${getBackendUrl()}/api/customer/password`, passwords, { headers: { token } })
    if (response.data.success) return response.data
    throw new Error(response.data.message)
  }
)

export const fetchAddresses = createAsyncThunk("customer/fetchAddresses", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.get(`${getBackendUrl()}/api/customer/profile`, { headers: { token } })
  if (response.data.success) return (response.data.user.addresses || []) as Address[]
  return []
})

export const addAddress = createAsyncThunk(
  "customer/addAddress",
  async (address: Address, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/customer/addresses`, { address }, { headers: { token } })
    if (response.data.success) return response.data.addresses as Address[]
    throw new Error(response.data.message)
  }
)

export const deleteAddress = createAsyncThunk(
  "customer/deleteAddress",
  async (id: string, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.delete(`${getBackendUrl()}/api/customer/addresses/${id}`, { headers: { token } })
    if (response.data.success) return response.data.addresses as Address[]
    throw new Error(response.data.message)
  }
)

export const setDefaultAddress = createAsyncThunk(
  "customer/setDefaultAddress",
  async (id: string, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.put(`${getBackendUrl()}/api/customer/addresses/${id}/default`, {}, { headers: { token } })
    if (response.data.success) return response.data.addresses as Address[]
    throw new Error(response.data.message)
  }
)

export const fetchWishlist = createAsyncThunk("customer/fetchWishlist", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  if (!token) return []
  const response = await axios.get(`${getBackendUrl()}/api/customer/wishlist`, { headers: { token } })
  if (response.data.success) return response.data.wishlist || []
  return []
})

export const addToWishlist = createAsyncThunk(
  "customer/addToWishlist",
  async (productId: string, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/customer/wishlist`, { productId }, { headers: { token } })
    if (response.data.success) return response.data.wishlist as string[]
    throw new Error(response.data.message)
  }
)

export const removeFromWishlistInternal = createAsyncThunk(
  "customer/removeFromWishlist",
  async (productId: string, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.delete(`${getBackendUrl()}/api/customer/wishlist/${productId}`, { headers: { token } })
    if (response.data.success) return response.data.wishlist as string[]
    throw new Error(response.data.message)
  }
)

export const fetchNotifications = createAsyncThunk("customer/fetchNotifications", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.get(`${getBackendUrl()}/api/customer/notifications`, { headers: { token } })
  if (response.data.success) return (response.data.notifications || []) as Notification[]
  return []
})

export const fetchSupportTickets = createAsyncThunk("customer/fetchSupportTickets", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.get(`${getBackendUrl()}/api/customer/support`, { headers: { token } })
  if (response.data.success) return (response.data.tickets || []) as SupportTicket[]
  return []
})

export const createSupportTicket = createAsyncThunk(
  "customer/createSupportTicket",
  async (ticket: { subject: string; category: string; message: string; orderId?: string }, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/customer/support`, ticket, { headers: { token } })
    if (response.data.success) return response.data
    throw new Error(response.data.message)
  }
)

export const fetchRewards = createAsyncThunk("customer/fetchRewards", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.get(`${getBackendUrl()}/api/customer/rewards`, { headers: { token } })
  if (response.data.success) return response.data.rewards as Reward
  throw new Error(response.data.message)
})

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<string[]>) {
      state.wishlist = action.payload
    },
    clearCustomerData(state) {
      state.profile = null
      state.addresses = []
      state.wishlist = []
      state.notifications = []
      state.supportTickets = []
      state.rewards = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.addresses = action.payload.addresses || []
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.addresses = action.payload.addresses || []
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => { state.addresses = action.payload })
      .addCase(addAddress.fulfilled, (state, action) => { state.addresses = action.payload })
      .addCase(deleteAddress.fulfilled, (state, action) => { state.addresses = action.payload })
      .addCase(setDefaultAddress.fulfilled, (state, action) => { state.addresses = action.payload })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.wishlist = action.payload })
      .addCase(addToWishlist.fulfilled, (state, action) => { state.wishlist = action.payload })
      .addCase(removeFromWishlistInternal.fulfilled, (state, action) => { state.wishlist = action.payload })
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.notifications = action.payload })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => { state.supportTickets = action.payload })
      .addCase(fetchRewards.fulfilled, (state, action) => { state.rewards = action.payload })
  }
})

export const { setWishlistItems, clearCustomerData } = customerSlice.actions
export default customerSlice.reducer
