import express from 'express'
import { protectRoute } from '../Middlewares/verifyjwt.js'
import { getMessages, getuserforleftsidebar, markMessageAsSeen, sendMessage } from '../Controllers/message.controller.js'

const router = express.Router()

router.get('/users', protectRoute, getuserforleftsidebar)
router.get('/:id', protectRoute, getMessages)
router.put('/mark/:id', protectRoute, markMessageAsSeen)
router.post('/send/:id', protectRoute, sendMessage)

export default router;