import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try { schema.parse(req.body); next() }
    catch (err) { if (err instanceof ZodError) return res.status(400).json({ success: false, message: err.errors.map(e => e.message).join(', ') }) }
  }
}
