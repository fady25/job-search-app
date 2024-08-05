// imports
import mongoose, { model } from "mongoose"

// schema 

const userSchema = new mongoose.Schema({ 
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    recoveryEmail: { type: String },
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, unique: true, required: true },
    role: { type: String, enum: ['User', 'Company_HR'], required: true },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' }
  }, {
    timestamps: true
})

// Middleware to set the username before saving

userSchema.pre('save', function(next) {
    this.username = `${this.firstName}${this.lastName}`
    next()
  })


// model
export const User = model('user',userSchema)