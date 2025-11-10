import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.get('/create-account', authController.register); //by admin 
// router.get('/create-account', verify-Adminrole-middleware, authController.register); 

router.get('/login', authController.handleLogin);
// router.get('/refresh', userController.getAllUsers);
// router.get('/logout', userController.getUserById);

export default router;
