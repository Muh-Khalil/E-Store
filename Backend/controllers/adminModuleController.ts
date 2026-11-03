import adminModuleModel from '../models/adminModuleModel.js'
import { Request, Response } from 'express'
import { paginate } from '../helpers.js'

const listModuleRecords = async (req: Request, res: Response) => {
  try {
    const { module } = req.params
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [records, total] = await Promise.all([
      adminModuleModel.find({ module }).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      adminModuleModel.countDocuments({ module }),
    ])
    res.json({ success: true, records, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const createModuleRecord = async (req: Request, res: Response) => {
  try {
    const { module } = req.params
    const { title, description, status, metadata } = req.body

    if (!title) {
      return res.json({ success: false, message: 'Title is required' })
    }

    const record = new adminModuleModel({
      module,
      title,
      description,
      status,
      metadata,
    })

    await record.save()
    res.json({ success: true, message: 'Record created', record })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateModuleRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const record = await adminModuleModel.findByIdAndUpdate(id, req.body, { new: true })
    res.json({ success: true, message: 'Record updated', record })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const deleteModuleRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await adminModuleModel.findByIdAndDelete(id)
    res.json({ success: true, message: 'Record removed' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

export { listModuleRecords, createModuleRecord, updateModuleRecord, deleteModuleRecord }
