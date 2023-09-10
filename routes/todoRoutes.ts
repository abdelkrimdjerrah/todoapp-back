
import { Router } from 'express';
import todoController from '../controllers/todoController';
import verifyJWT from '../middleware/verifyJWT'

const router: Router = Router();

router.use(verifyJWT)

router
  .route("/")
  .get(todoController.getTodos)
  .post(todoController.createTodo)

router
    .route("/:todoId")
    .delete(todoController.deleteTodo)
    .patch(todoController.isDoneTodo)  

module.exports = router