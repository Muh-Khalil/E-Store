import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { Discount } from "../types"
import type { RootState } from "./index"

interface CartState {
  items: Record<string, Record<string, number>>
  loading: boolean
  error: string | null
  deliveryFee: number
  currency: string
  discount: Discount | null
}

const initialState: CartState = {
  items: {},
  loading: false,
  error: null,
  deliveryFee: 10,
  currency: "$",
  discount: null,
}

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { getState }) => {
  const state = getState() as RootState
  const token = state.auth.token
  if (!token) return {}
  const response = await axios.post(`${getBackendUrl()}/api/cart/get`, {}, { headers: { token } })
  if (response.data.success) return response.data.cartData || {}
  return {}
})

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ itemId, size }: { itemId: string; size: string }, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (token) {
      await axios.post(`${getBackendUrl()}/api/cart/add`, { itemId, size }, { headers: { token } })
    }
    return { itemId, size }
  }
)

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ itemId, size, quantity }: { itemId: string; size: string; quantity: number }, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (token) {
      await axios.post(`${getBackendUrl()}/api/cart/update`, { itemId, size, quantity }, { headers: { token } })
    }
    return { itemId, size, quantity }
  }
)

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
})

export const validatePromotion = createAsyncThunk(
  "cart/validatePromotion",
  async (code: string, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (!token) throw new Error("Login to apply promotion codes")
    const subtotal = Object.entries(state.cart.items).reduce((total, [itemId, sizes]) => {
      const product = state.products.products.find(p => p._id === itemId)
      if (product) {
        for (const qty of Object.values(sizes)) total += product.price * qty
      }
      return total
    }, 0)
    const response = await axios.post(`${getBackendUrl()}/api/customer/promotion/validate`, { code, subtotal }, { headers: { token } })
    if (response.data.success) {
      return { code: response.data.promotion.code, discount: response.data.discount }
    }
    throw new Error(response.data.message)
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload
    },
    clearLocalCart(state) {
      state.items = {}
      state.discount = null
    },
    setCartDiscount(state, action) {
      state.discount = action.payload
    },
    clearDiscount(state) {
      state.discount = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { itemId, size } = action.payload
        if (!state.items[itemId]) state.items[itemId] = {}
        state.items[itemId][size] = (state.items[itemId][size] || 0) + 1
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const { itemId, size, quantity } = action.payload
        if (quantity <= 0) {
          if (state.items[itemId]) delete state.items[itemId][size]
          if (state.items[itemId] && Object.keys(state.items[itemId]).length === 0) delete state.items[itemId]
        } else {
          if (!state.items[itemId]) state.items[itemId] = {}
          state.items[itemId][size] = quantity
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = {}
        state.discount = null
      })
      .addCase(validatePromotion.fulfilled, (state, action) => {
        state.discount = action.payload
      })
  }
})

export const { setCartItems, clearLocalCart, setCartDiscount, clearDiscount } = cartSlice.actions
export default cartSlice.reducer
