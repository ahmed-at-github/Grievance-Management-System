import { Router } from 'express';
import * as authController from './auth.controller.js';

const router = Router();

router.get('/create-account', authController.register); //by admin 
// router.post('/create-account', verifyJwtToken, verify-Adminrole-middleware, authController.register); 

router.get('/login', authController.handleLogin);
// router.get('/refresh', verifyJwtRefreshToken, userController.getAllUsers);
// router.get('/me', verifyJwtToken, authController.handleLogin); get users info, stud/vc/admin

// router.get('/logout', userController.getUserById);

export default router;
