// imports
import mongoose, { model } from "mongoose"

// schema
const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userTechSkills: { type: [String], required: true },
    userSoftSkills: { type: [String], required: true },
    userResume: { type: String, required: true }
  }, {
    timestamps: true
  })

// model
const Application = model('Application', applicationSchema)

export default Application