import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { User } from "../../../DB/models/userModel.js"
import dotenv from 'dotenv'
import { generateOTP, sendOTPEmail } from "../auth/auth.controller.js"

let otp;

export const signUp = async (req, res) => {
    const { firstName, lastName, username, email, password, role, mobileNumber, DOB } = req.body
    try {
        // Check if user already exists
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }else{
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            DOB,
            mobileNumber,
            role,
            status: 'offline'
        })

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                email: savedUser.email,
                DOB: savedUser.DOB,
                mobileNumber: savedUser.mobileNumber,
                role: savedUser.role,
                status: savedUser.status
            },
            token
        })
    }} catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const signIn = async (req, res) => {
    const { email, password,mobileNumber,recoveryEmail } = req.body

    try {
        // Check if user exists
        const user = await User.findOne({ $or: [{ email }, { mobileNumber },{recoveryEmail}] })
        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' })
        }

        // Update status to online

        else {
            user.status = 'online'
            await user.save()

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

            res.json({ token })
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const updateAccount = async (req, res) => {
    const { id } = req.user
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body
    // const userId = req..id // From authenticated user

    try {
        // Check if the user is updating their own account
        if (userId.toString() !== id) {
            return res.status(403).json({ message: 'Unauthorized to update this account' })
        }

        // Check if updated email or mobileNumber already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] })
        if (existingUser && existingUser._id.toString() !== id) {
            return res.status(400).json({ message: 'Email or mobile number already exists' })
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, { email, mobileNumber, recoveryEmail, DOB, lastName, firstName }, { new: true })

        res.json(updatedUser)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteAccount = async (req, res) => {
    const { id } = req.params
    const userId = req.params.id // From authenticated user

    try {
        // Check if the user is deleting their own account
        if (userId.toString() !== id) {
            return res.status(403).json({ message: 'Unauthorized to delete this account' })
        }

        // Delete user
        await User.findByIdAndDelete(id)

        res.json({ message: 'Account deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUserAccount = async (req, res) => {
    const userId = req.params.id // From authenticated user
    try {
        // Check if the user is fetching their own account data
        let token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (userId == decoded.userId) {
            // Fetch user account data
            const user = await User.findById(userId)
            res.json(user)
        }
        else {
            res.json("not authorized")
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}
export const getProfileData = async (req, res) => {
    const { userId } = req.params

    try {
        // Fetch profile data for another user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updatePassword = async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id // From authenticated user

    try {
        // Check if the user is updating their own password
        if (userId.toString() !== id) {
            return res.status(403).json({ message: 'Unauthorized to update password for this account' })
        }

        // Fetch user
        const user = await User.findById(id)

        // Validate current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid current password' })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        user.password = hashedPassword
        await user.save()

        res.json({ message: 'Password updated successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
         res.status(404).json({ message: 'User not found' })
        }else{

        // Generate OTP
        otp = generateOTP()
        // Save OTP in user document (or in a separate OTP collection)

        // Send OTP via email
        await sendOTPEmail(email, otp)

        res.json({ message: 'OTP sent to registered email' })
    } }catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const resetPassword = async (req, res) => {
    const { email, userotp, newPassword } = req.body

    try {
        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if OTP matches
        if (userotp !== otp) {
             res.status(400).json({ message: 'Invalid OTP' })
        }else{

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update user's password
        user.password = hashedPassword
        user.resetPasswordOTP = undefined // Clear OTP after password reset
        await user.save()

        res.json({ message: 'Password reset successful' })
    }} catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUsersByRecoveryEmail = async (req, res) => {
    const { recoveryEmail } = req.params
    
    try { 
        // Fetch accounts associated with recovery email
        const users = await User.find({ recoveryEmail })

        res.json(users)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

