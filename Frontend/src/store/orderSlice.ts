import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { Order } from "../types"
import type { RootState } from "./index"

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
}

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  const response = await axios.post(`${getBackendUrl()}/api/order/userorders`, {}, { headers: { token } })
  if (response.data.success) return response.data.orders as Order[]
  throw new Error(response.data.message)
})

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData: Record<string, unknown>, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/order/place`, orderData, { headers: { token } })
    if (response.data.success) return response.data
    throw new Error(response.data.message)
  }
)

export const placeOrderStripe = createAsyncThunk(
  "orders/placeOrderStripe",
  async (orderData: Record<string, unknown>, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/order/stripe`, orderData, { headers: { token } })
    if (response.data.success) return response.data
    throw new Error(response.data.message)
  }
)

export const placeOrderPayoneer = createAsyncThunk(
  "orders/placeOrderPayoneer",
  async (orderData: Record<string, unknown>, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const response = await axios.post(`${getBackendUrl()}/api/order/payoneer`, orderData, { headers: { token } })
    if (response.data.success) return response.data
    throw new Error(response.data.message)
  }
)

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload
        state.loading = false
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch orders"
      })
      .addCase(placeOrder.fulfilled, (state) => { state.currentOrder = null })
      .addCase(placeOrderStripe.fulfilled, (_state, action) => {
        if (action.payload.session_url) {
          window.location.replace(action.payload.session_url)
        }
      })
      .addCase(placeOrderPayoneer.fulfilled, (_state, action) => {
        if (action.payload.session_url) {
          window.location.replace(action.payload.session_url)
        }
      })
  }
})

export const { setCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
