import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types.js'
import { auth } from '../auth.js'
import jwt from 'jsonwebtoken'

const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const headers = { ...req.headers }
    const token = req.headers.token as string || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (token) {
      // 1. Try custom JWT first
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin?: boolean }
        if (decoded && decoded.id && decoded.isAdmin) {
          req.user = { id: decoded.id, isAdmin: true }
          return next()
        }
      } catch (jwtErr) {
        // Fall back to Better Auth
      }

      // 2. Map to standard Bearer for Better Auth
      headers.authorization = `Bearer ${token}`
    }

    const session = await auth.api.getSession({ headers: headers as any })
    if (!session) return res.status(401).json({ success: false, message: "Not authorized" })
    const isAdmin = (session.user as any).role === "admin"
    if (!isAdmin) return res.status(401).json({ success: false, message: "Access denied" })
    req.user = { id: session.user.id, isAdmin: true }
    next()
  } catch (err) {
    res.status(401).json({ success: false, message: "Auth error" })
  }
}

export default adminAuth
