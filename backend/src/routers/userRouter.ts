import express, { Router }from 'express';
import { UserController } from '../controllers/userController';

const router: Router = express.Router();
const userController = new UserController();

router.get('/:id', userController.getById);
router.get('/', userController.getUsers);
router.post('/', userController.postUser);
router.patch('/:id', userController.patchUser);
router.delete('/:id', userController.deleteUser);

export default router;
