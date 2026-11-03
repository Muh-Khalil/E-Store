import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Product } from "../types"

interface ProductFilters {
  category: string
  subCategory: string
  search: string
  sort: string
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  showSearch: boolean
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filters: { category: "", subCategory: "", search: "", sort: "" },
  showSearch: false,
}

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit }: { page?: number; limit?: number } = {}) => {
    const response = await axios.get(`${getBackendUrl()}/api/product/list`, { params: { page, limit } })
    if (response.data.success) return response.data.products as Product[]
    throw new Error(response.data.message)
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload
    },
    setSubCategory(state, action: PayloadAction<string>) {
      state.filters.subCategory = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload
    },
    setSort(state, action: PayloadAction<string>) {
      state.filters.sort = action.payload
    },
    setShowSearch(state, action: PayloadAction<boolean>) {
      state.showSearch = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload
        state.loading = false
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
  }
})

export const { setCategory, setSubCategory, setSearch, setSort, setShowSearch } = productSlice.actions
export default productSlice.reducer
