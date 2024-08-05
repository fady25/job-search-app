import { asyncHandler } from "../../asyncHandler.js"
import  Company  from "../../../DB/models/companyModel.js"
import Job from "../../../DB/models/jobModel.js";




// Add Company
export const addCompany = asyncHandler(async (req, res) => {
    const company = await Company.create(req.body);
    res.status(201).json(company);
})

// Search for Company by Name
export const searchCompany = asyncHandler(async (req, res) => {
    try {
        let { companyname } = req.query
       
        // Check if companyName is provided and convert to string
        if (!companyname) {
            return res.status(400).json({ message: 'Company name parameter is required' });
        }
        
        // Perform case-insensitive search for companies
        const companies = await Company.find({ companyname})
        console.log(companyname)
        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: 'No companies found matching the search criteria' })
        }
        console.log(companyname)

        res.json(companies)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Update Company Data
export const updateCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const company = await Company.findById(companyId)

if (!company) {
    res.status(404)
    throw new Error('Company not found')
} if (company.companyHR.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized to update this company')
}

// Update company data
Object.assign(company, req.body)
await company.save()

res.json(company)
})

export const deleteCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const company = await Company.findById(companyId)

    if (!company) {
        res.status(404)
        throw new Error('Company not found')
    }

    // Check if the current user is authorized to delete this company
    if (company.companyHR.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error('Not authorized to delete this company')
    }

    // Delete company
    await company.deleteOne()

    res.json({ message: 'Company removed' })
})





// Get Company Data
export const getCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const company = await Company.findById(companyId)

    if (!company) {
        res.status(404)
        throw new Error('Company not found')
    }
else{
    res.json(company)
}})



// Get All Applications for Specific Job
export const getApplicationsForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params
    const job = await Job.findById(jobId)
    res.json(job)
    if (!job) {
        res.status(404)
        throw new Error('Job not found')
    }

    res.json(job.applications)
})