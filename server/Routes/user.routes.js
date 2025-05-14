import express from 'express'
import { checkAuth, loginUser, logoutUser, refreshToken, registerUser, updateProfile } from '../Controllers/user.controller.js'
import { protectRoute } from '../Middlewares/verifyjwt.js'
import upload from '../Utils/multer.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/refresh-token', refreshToken)
router.get('/checkAuth', protectRoute, checkAuth)
router.post('/logout', protectRoute, logoutUser)
router.put('/update-profile', upload.single('profilePic'), protectRoute, updateProfile)

export default router;