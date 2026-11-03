import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { authClient } from "../lib/auth-client"
import type { User } from "../types"

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  initialized: false,
}

export const login = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await authClient.signIn.email({ email, password })
  if (error) throw new Error(error.message)
  return data
})

export const register = createAsyncThunk("auth/register", async ({ name, email, password }: { name: string; email: string; password: string }) => {
  const { data, error } = await authClient.signUp.email({ email, password, name })
  if (error) throw new Error(error.message)
  return data
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await authClient.signOut()
  localStorage.removeItem("token")
})

export const fetchSession = createAsyncThunk("auth/fetchSession", async () => {
  const { data } = await authClient.getSession()
  return data
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      if (action.payload) localStorage.setItem("token", action.payload)
      else localStorage.removeItem("token")
    },
    clearAuth(state) {
      state.user = null
      state.token = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = (action.payload?.user as unknown as User) || null
        state.token = action.payload?.token || null
        state.initialized = true
      })
      .addCase(register.fulfilled, (state) => { state.initialized = true })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.user = (action.payload?.user as unknown as User) || null
        state.initialized = true
      })
      .addCase(fetchSession.rejected, (state) => { state.initialized = true })
  }
})

export const { setToken, clearAuth } = authSlice.actions
export default authSlice.reducer
