import { Router } from 'express'
import authController from '../controllers/authController'
import loginLimiter from '../middleware/loginLimiter'

const router: Router = Router()

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

    module.exports = router