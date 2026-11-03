import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { backendUrl } from "../App"
import type { Promotion, MarketingCampaign, ContentItem, AnalyticsData } from "../types"

interface GrowthState {
  promotions: Promotion[]
  campaigns: MarketingCampaign[]
  contentItems: ContentItem[]
  analytics: AnalyticsData | null
  loading: boolean
}

const initialState: GrowthState = {
  promotions: [],
  campaigns: [],
  contentItems: [],
  analytics: null,
  loading: false,
}

export const fetchPromotions = createAsyncThunk("growth/fetchPromotions", async (_, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.get(`${backendUrl}/api/admin-growth/promotions`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data.promotions as Promotion[]
})

export const createPromotion = createAsyncThunk("growth/createPromotion", async (form: Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.post(`${backendUrl}/api/admin-growth/promotions`, form, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const updatePromotion = createAsyncThunk("growth/updatePromotion", async ({ id, ...patch }: { id: string } & Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.put(`${backendUrl}/api/admin-growth/promotions/${id}`, patch, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const removePromotion = createAsyncThunk("growth/removePromotion", async (id: string, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.delete(`${backendUrl}/api/admin-growth/promotions/${id}`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return id
})

export const fetchCampaigns = createAsyncThunk("growth/fetchCampaigns", async (_, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.get(`${backendUrl}/api/admin-growth/marketing`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data.campaigns as MarketingCampaign[]
})

export const createCampaign = createAsyncThunk("growth/createCampaign", async (form: Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.post(`${backendUrl}/api/admin-growth/marketing`, form, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const updateCampaign = createAsyncThunk("growth/updateCampaign", async ({ id, ...patch }: { id: string } & Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.put(`${backendUrl}/api/admin-growth/marketing/${id}`, patch, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const removeCampaign = createAsyncThunk("growth/removeCampaign", async (id: string, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.delete(`${backendUrl}/api/admin-growth/marketing/${id}`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return id
})

export const fetchContent = createAsyncThunk("growth/fetchContent", async (_, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.get(`${backendUrl}/api/admin-growth/content`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data.items as ContentItem[]
})

export const createContent = createAsyncThunk("growth/createContent", async (form: Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.post(`${backendUrl}/api/admin-growth/content`, form, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const updateContent = createAsyncThunk("growth/updateContent", async ({ id, ...patch }: { id: string } & Record<string, unknown>, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.put(`${backendUrl}/api/admin-growth/content/${id}`, patch, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data
})

export const removeContent = createAsyncThunk("growth/removeContent", async (id: string, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.delete(`${backendUrl}/api/admin-growth/content/${id}`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return id
})

export const fetchAnalytics = createAsyncThunk("growth/fetchAnalytics", async (_, { getState }) => {
  const state = getState() as { auth: { token: string | null } }
  const response = await axios.get(`${backendUrl}/api/admin-growth/analytics`, { headers: { token: state.auth.token } })
  if (!response.data.success) throw new Error(response.data.message)
  return response.data as AnalyticsData
})

const growthSlice = createSlice({
  name: "growth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => { state.loading = true })
      .addCase(fetchPromotions.fulfilled, (state, action) => { state.loading = false; state.promotions = action.payload })
      .addCase(fetchPromotions.rejected, (state) => { state.loading = false })
      .addCase(fetchCampaigns.fulfilled, (state, action) => { state.campaigns = action.payload })
      .addCase(fetchContent.fulfilled, (state, action) => { state.contentItems = action.payload })
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.loading = false; state.analytics = action.payload })
      .addCase(fetchAnalytics.rejected, (state) => { state.loading = false })
      .addCase(removePromotion.fulfilled, (state, action) => { state.promotions = state.promotions.filter(p => p._id !== action.payload) })
      .addCase(removeCampaign.fulfilled, (state, action) => { state.campaigns = state.campaigns.filter(c => c._id !== action.payload) })
      .addCase(removeContent.fulfilled, (state, action) => { state.contentItems = state.contentItems.filter(c => c._id !== action.payload) })
  }
})

export default growthSlice.reducer
