import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { backendUrl } from "../App"
import type { Customer } from "../types"

interface CustomerState {
  customers: Customer[]
  total: number
  loading: boolean
}

const initialState: CustomerState = {
  customers: [],
  total: 0,
  loading: false,
}

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.get(`${backendUrl}/api/admin-store/customers`, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return { customers: response.data.customers as Customer[], total: response.data.total || 0 }
  }
)

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload.customers
        state.total = action.payload.total
      })
      .addCase(fetchCustomers.rejected, (state) => { state.loading = false })
  }
})

export default customerSlice.reducer
