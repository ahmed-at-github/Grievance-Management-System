import { Router } from 'express';
import * as authController from './auth.controller.js';
import {
    verifyAccessToken,
    verifyRefreshToken,
} from '../../middlewares/verifyJwtToken.js';
import { authorizeRole } from '../../middlewares/verifyUserRole.js';

const router = Router();

router.post(
    '/create-account',
    verifyAccessToken,
    authorizeRole(['admin']),
    authController.register,
);
router.post('/login', authController.handleLogin);
router.get('/refresh', verifyRefreshToken, authController.getRefreshToken);
router.get('/me', verifyAccessToken, authController.getUserInfo);
router.post('/logout', authController.handleLogout);

export default router;
