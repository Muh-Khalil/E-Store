import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { PaymentMethod } from "../types"

interface PaymentState {
  config: { methods: PaymentMethod[] } | null
  loading: boolean
  error: string | null
}

const initialState: PaymentState = {
  config: null,
  loading: false,
  error: null,
}

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

export const fetchPaymentConfig = createAsyncThunk("payment/fetchPaymentConfig", async () => {
  const response = await axios.get(`${getBackendUrl()}/api/payment/config`)
  if (response.data.success) return response.data.config
  return { methods: [] }
})

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentConfig.pending, (state) => { state.loading = true })
      .addCase(fetchPaymentConfig.fulfilled, (state, action) => {
        state.config = action.payload
        state.loading = false
      })
      .addCase(fetchPaymentConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch payment config"
      })
  }
})

export default paymentSlice.reducer
