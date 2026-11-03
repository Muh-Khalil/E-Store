import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { backendUrl } from "../App"
import type { Order } from "../types"

interface OrderState {
  orders: Order[]
  total: number
  page: number
  loading: boolean
}

const initialState: OrderState = {
  orders: [],
  total: 0,
  page: 1,
  loading: false,
}

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(
      backendUrl + "/api/order/list",
      { page, limit },
      { headers: { token: state.auth.token } }
    )
    if (!response.data.success) throw new Error(response.data.message)
    return { orders: (response.data.orders || []).reverse() as Order[], total: response.data.totalPages || 1, page }
  }
)

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }: { orderId: string; status: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(
      backendUrl + "/api/order/status",
      { orderId, status },
      { headers: { token: state.auth.token } }
    )
    if (!response.data.success) throw new Error(response.data.message)
    return { orderId, status }
  }
)

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderPage(state, action) {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.total = action.payload.total
        state.page = action.payload.page
      })
      .addCase(fetchOrders.rejected, (state) => { state.loading = false })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload.orderId)
        if (idx !== -1) state.orders[idx].status = action.payload.status
      })
  }
})

export const { setOrderPage } = orderSlice.actions
export default orderSlice.reducer
