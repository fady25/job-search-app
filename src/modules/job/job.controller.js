import asyncHandler from 'express-async-handler'
import Job from '../../../DB/models/jobModel.js'
import Application from '../../../DB/models/applicationModel.js'
import Company from '../../../DB/models/companyModel.js'
import { User } from '../../../DB/models/userModel.js'
import mongoose from 'mongoose';


// Add Job
export const addJob = asyncHandler(async (req, res) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy, companyname } = req.body

    const job = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        companyname
    })

    await job.save()

    res.status(201).json({ success: true, data: job })
})

// Update Job
export const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    const job = await Job.findByIdAndUpdate(id, updates, { new: true })

    if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' })
        return
    }

    res.status(200).json({ success: true, data: job })
})

// Delete Job
export const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' })
        return
    }

    res.status(200).json({ success: true, message: 'Job deleted successfully' })
})


// Get all Jobs for a specific company
export const getJobsByCompany = asyncHandler(async (req, res) => {
    const { companyname } = req.query

    try {
        // Find the company by name
        const company = await Company.findOne({ companyname })

        if (!company) {
            res.status(404).json({ success: false, message: 'Company not found' })
        }

        // Find jobs associated with the found company
        console.log(company);
        const jobs = await Job.find({ companyname: company.companyname })
       
        if (jobs.length === 0) {
            res.status(404).json({ success: false, message: 'No jobs found for this company' })
        }
        else {
            res.status(200).json({ success: true, data: jobs })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
})

// Get all Jobs that match the following filters
export const getFilteredJobs = asyncHandler(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query

    const filter = {}
    if (workingTime) filter.workingTime = workingTime
    if (jobLocation) filter.jobLocation = jobLocation
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel
    if (jobTitle) filter.jobTitle = jobTitle
    if (technicalSkills) filter.technicalSkills = { $all: technicalSkills.split(',') }

    const jobs = await Job.find(filter)

    res.status(200).json({ success: true, data: jobs })
})

// Get all Jobs with their company’s information
export const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ addedBy: req.params.id })

    res.status(200).json({ success: true, data: jobs })
})




// Apply to Job
export const applyToJob = asyncHandler(async (req, res) => {
    const { jobId, userId,userTechSkills, userSoftSkills, userResume } = req.body
    const newuserid=new mongoose.Types.ObjectId(userId)
    const newjobid=new mongoose.Types.ObjectId(jobId)

    const application = new Application({
        jobId:newjobid,
        userId:newuserid,
        userTechSkills,
        userSoftSkills,
        userResume
    })

    await application.save()

    res.status(201).json({ success: true, data: application })
})