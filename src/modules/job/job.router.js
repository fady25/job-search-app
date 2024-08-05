import express from 'express'
import {
    addJob,
    updateJob,
    deleteJob,
    getAllJobs,
    getJobsByCompany,
    getFilteredJobs,
    applyToJob
} from '../../modules/job/job.controller.js'
import { authorize, protect } from '../../middleware/authentication.js'

const jobRouter = express.Router()

jobRouter.post('/jobs', protect, authorize('Company_HR'), addJob)
jobRouter.put('/jobs/:id', protect, authorize('Company_HR'), updateJob)
jobRouter.delete('/jobs/:id', protect, authorize('Company_HR'), deleteJob)
jobRouter.get('/jobs/company', protect, authorize('User', 'Company_HR'), getJobsByCompany)
jobRouter.get('/jobs/filter', protect, authorize('User', 'Company_HR'), getFilteredJobs)
jobRouter.get('/jobs/:id', protect, authorize('User', 'Company_HR'), getAllJobs)
jobRouter.post('/jobs/apply', protect, authorize('User'), applyToJob)

export default jobRouter
