import express from 'express'
import { handelUserRegister, handelUserLogin } from '../controllers/url.js'

const router = express.Router()

router.post("/signup", handelUserRegister)

router.post("/login", handelUserLogin )

export default router