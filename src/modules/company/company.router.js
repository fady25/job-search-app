import { Router } from 'express'
import { addCompany, updateCompany, deleteCompany, getCompany, searchCompany, getApplicationsForJob } from '../../modules/company/company.controller.js'
import { protect, authorize } from '../../middleware/authentication.js'

const companyRouter = Router()
// Add Company (protected route, only accessible to Company_HR)
companyRouter.post('/company', protect, authorize('Company_HR'), addCompany)

// Search for Company by Name (protected route, accessible to Company_HR and Users)
companyRouter.get('/company/search', protect, authorize('Company_HR', 'User'), searchCompany)

// Update Company Data (protected route, only accessible to Company_HR who owns the company)
companyRouter.put('/company/:companyId', protect, authorize('Company_HR'), updateCompany)

// Delete Company Data (protected route, only accessible to Company_HR who owns the company)
companyRouter.delete('/company/:companyId', protect, authorize('Company_HR'), deleteCompany)

// Get Company Data (protected route, accessible to Company_HR and Users)
companyRouter.get('/company/:companyId', protect ,authorize('Company_HR'), getCompany)

// Get All Applications for Specific Job (protected route, accessible to Company_HR)
companyRouter.get('/company/job/:jobId/applications', protect, authorize('Company_HR'), getApplicationsForJob)

export default companyRouter