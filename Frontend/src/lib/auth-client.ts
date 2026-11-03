import { createAuthClient } from "better-auth/client"
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
export const authClient = createAuthClient({ baseURL: backendUrl })
