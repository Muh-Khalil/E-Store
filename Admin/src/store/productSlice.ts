import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { backendUrl } from "../App"
import type { Product } from "../types"

interface ProductState {
  products: Product[]
  total: number
  page: number
  limit: number
  loading: boolean
  editingProduct: Product | null
}

const initialState: ProductState = {
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  editingProduct: null,
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await axios.get(backendUrl + "/api/product/list", { params: { page, limit } })
    if (!response.data.success) throw new Error(response.data.message)
    return { products: response.data.products as Product[], total: response.data.totalPages || 1, page, limit }
  }
)

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (productId: string) => {
    const response = await axios.post(backendUrl + "/api/product/single", { productId })
    if (!response.data.success) throw new Error(response.data.message)
    return response.data.product as Product
  }
)

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (formData: FormData, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (formData: FormData, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return response.data
  }
)

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id: string, { getState }) => {
    const state = getState() as { auth: { token: string | null } }
    const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token: state.auth.token } })
    if (!response.data.success) throw new Error(response.data.message)
    return id
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setEditingProduct(state, action) {
      state.editingProduct = action.payload
    },
    setPage(state, action) {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.editingProduct = action.payload
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.editingProduct = null
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  }
})

export const { setEditingProduct, setPage } = productSlice.actions
export default productSlice.reducer
