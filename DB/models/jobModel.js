// imports
import mongoose, { model } from "mongoose"



//schema
const jobSchema = new mongoose.Schema({
    jobTitle:{  type:String, required:true  },
    jobLocation:{  type:String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
    workingTime:{   type:String, enum:['part-time','full-time'], required: true },
    seniorityLevel: {   type:String, enum:['junior','mid-level','senior-team','team-lead','CTO'], required: true },
    jobDescription: { type:String, required: true },
    technicalSkills: { type:String, required: true },
    softSkills: { type:String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyname:{   type:String , unique:false , required:true   }
}, {
  timestamps: true
})

// model
const Job = model('Job',jobSchema)
export default Job