import { Router } from 'express'
import {protect} from '../../middleware/authentication.js';
import { signUp, signIn, updateAccount, deleteAccount, getUserAccount, getProfileData, updatePassword, forgotPassword, resetPassword, getUsersByRecoveryEmail } from '../../modules/user/user.controller.js';

const userRouter = Router()
// User routes
userRouter.post('/signup', signUp)
userRouter.post('/signin', signIn)
userRouter.put('/user/:id', protect, updateAccount)
userRouter.delete('/user/:id', protect, deleteAccount)
userRouter.get('/user/:id', protect, getUserAccount)
userRouter.get('/user/profile/:userId', protect, getProfileData)
userRouter.put('/user/updatepassword/:id', protect, updatePassword)
userRouter.post('/user/forgotpassword/:id', forgotPassword)
userRouter.post('/user/resetpassword/:id', resetPassword)
userRouter.get('/users/byrecoveryemail/:recoveryEmail', getUsersByRecoveryEmail)

export default userRouter