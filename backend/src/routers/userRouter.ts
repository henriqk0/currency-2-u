import express, { Router }from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = express.Router();
const userController = new UserController();

router.get('/', userController.getUsers);
router.post('/', userController.postUser);

router.get('/:id', authMiddleware, (req, res) => userController.getById(req, res));
router.patch('/:id', authMiddleware, (req, res) => userController.patchUser(req, res));
router.delete('/:id', authMiddleware, (req, res) => userController.deleteUser(req, res));

export default router;
