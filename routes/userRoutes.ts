import { Router } from 'express';
import userController from '../controllers/userController';

const router: Router = Router();

router
  .route("/")
  .post(userController.createUser)

module.exports = router