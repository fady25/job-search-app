import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


// Function to generate OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000) // Generate a 6-digit OTP
}

// Function to send email with OTP
export const sendOTPEmail = async (email, otp) => {
    // Configure nodemailer (update with your email service provider details)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Email content
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
    }

    // Send email
    await transporter.sendMail(mailOptions)
}
