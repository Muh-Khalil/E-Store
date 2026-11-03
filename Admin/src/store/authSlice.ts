import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authClient } from "../lib/auth-client"
import axios from "axios"
import { backendUrl } from "../App"

interface AuthState {
  token: string | null
  loading: boolean
  initialized: boolean
}

const initialState: AuthState = {
  token: localStorage.getItem("adminToken"),
  loading: false,
  initialized: false,
}

export const adminLogin = createAsyncThunk("auth/adminLogin", async ({ email, password }: { email: string; password: string }) => {
  const response = await axios.post(backendUrl + "/api/user/admin", { email, password })
  if (!response.data.success) throw new Error(response.data.message || "Login failed")
  return response.data
})

export const adminLogout = createAsyncThunk("auth/logout", async () => {
  try {
    await authClient.signOut()
  } catch (error) {
    console.error("Error during Better Auth signout:", error)
  }
  localStorage.removeItem("adminToken")
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminToken(state, action) {
      state.token = action.payload
      if (action.payload) localStorage.setItem("adminToken", action.payload)
      else localStorage.removeItem("adminToken")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => { state.loading = true })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false
        const token = action.payload?.token || null
        state.token = token
        if (token) {
          localStorage.setItem("adminToken", token)
        } else {
          localStorage.removeItem("adminToken")
        }
      })
      .addCase(adminLogin.rejected, (state) => { state.loading = false })
      .addCase(adminLogout.fulfilled, (state) => { state.token = null })
  }
})

export const { setAdminToken } = authSlice.actions
export default authSlice.reducer
