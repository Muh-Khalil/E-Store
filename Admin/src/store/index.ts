import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import productReducer from "./productSlice"
import orderReducer from "./orderSlice"
import customerReducer from "./customerSlice"
import inventoryReducer from "./inventorySlice"
import growthReducer from "./growthSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    customers: customerReducer,
    inventory: inventoryReducer,
    growth: growthReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
