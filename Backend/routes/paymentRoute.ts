import express, { Router, Request, Response } from "express"

const paymentRouter: express.Router = Router()

paymentRouter.get("/config", (_req: Request, res: Response) => {
  res.json({
    success: true,
    methods: [
      { id: "stripe", name: "Stripe", enabled: !!process.env.STRIPE_SECRET_KEY },
      { id: "payoneer", name: "Payoneer", enabled: !!process.env.PAYONEER_API_URL }
    ],
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
  })
})

export default paymentRouter
