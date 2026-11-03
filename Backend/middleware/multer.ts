import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request } from 'express'

const storage = multer.diskStorage({
  filename: function (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
    const ext = path.extname(file.originalname)
    callback(null, crypto.randomUUID() + ext)
  },
})

const fileFilter = (_req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    callback(null, true)
  } else {
    callback(new Error('Only image files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export default upload
