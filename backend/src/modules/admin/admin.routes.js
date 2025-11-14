import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { verifyAccessToken } from '../../middlewares/verifyJwtToken.js';
import { authorizeRole } from '../../middlewares/verifyUserRole.js';

const router = Router();

router.get(
    '/users',
    verifyAccessToken,
    authorizeRole(['admin']),
    adminController.getAllUsers,
);

router.get(
    '/user/:userId',
    verifyAccessToken,
    authorizeRole(['admin']),
    adminController.getUserbyId,
);

router.delete(
    '/user/:userId',
    verifyAccessToken,
    authorizeRole(['admin']),
    adminController.deleteUserbyId,
);

// router.patch('/user/{id}', verifyJwtToken, verify-Adminrole-middleware, authController.register);

export default router;
