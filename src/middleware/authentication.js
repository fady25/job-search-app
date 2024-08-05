import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import {User} from '../../DB/models/userModel.js'
import dotenv from 'dotenv'

export const protect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password')
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found')
            }
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    else{(!token) 
        res.status(401)
        throw new Error('Not authorized, no token')
    }}
)

// Authorize Route: Check if user has required role(s)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
        return res.status(403).json({message:'Not authorized to access this route'})
        }
        next()
    }
}
