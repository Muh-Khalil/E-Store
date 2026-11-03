import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { backendUrl } from "../App"
import type { InventoryItem } from "../types"
import type { InventoryForm } from "../types"

interface InventoryState {
  records: InventoryItem[]
  total: number
  loading: boolean
}

const initialState: InventoryState = {
  records: [],
  total: 0,
  loading: false,
}

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.get(`${backendUrl}/api/admin-store/inventory`, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return { records: response.data.records as InventoryItem[], total: response.data.total || 0 }
  }
)

export const upsertInventory = createAsyncThunk(
  "inventory/upsertInventory",
  async (form: InventoryForm, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(`${backendUrl}/api/admin-store/inventory`, form, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return response.data
  }
)

export const removeInventory = createAsyncThunk(
  "inventory/removeInventory",
  async (id: string, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.delete(`${backendUrl}/api/admin-store/inventory/${id}`, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return id
  }
)

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload.records
        state.total = action.payload.total
      })
      .addCase(fetchInventory.rejected, (state) => { state.loading = false })
      .addCase(removeInventory.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r._id !== action.payload)
      })
  }
})

export default inventorySlice.reducer
