import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from '../controllers/adminModuleController.js'

const adminModuleRouter: express.Router = express.Router()

adminModuleRouter.get('/:module', adminAuth, listModuleRecords)
adminModuleRouter.post('/:module', adminAuth, createModuleRecord)
adminModuleRouter.put('/:id', adminAuth, updateModuleRecord)
adminModuleRouter.delete('/:id', adminAuth, deleteModuleRecord)

export default adminModuleRouter
