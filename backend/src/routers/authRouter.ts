import express, { Router }from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = express.Router();
const authController = new AuthController();

// router.post('/login', authController.login);
router.post('/login', (req, res) => authController.login(req, res));


export default router;
