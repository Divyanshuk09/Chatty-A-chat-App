import express from 'express'
import { loginUser, logoutUser, refreshToken, registerUser, updateProfile } from '../Controllers/user.controller.js'
import { protectRoute } from '../Middlewares/verifyjwt.js'
import upload from '../Utils/multer.js'

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',protectRoute,logoutUser)
router.get('/refresh-token',refreshToken)
router.put('/update-profile',upload.single('profilePic') ,protectRoute,updateProfile)

export default router;