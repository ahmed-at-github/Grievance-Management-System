import { Router } from 'express';
import * as complainController from './complain.controller.js';
import { verifyAccessToken } from '../../middlewares/verifyJwtToken.js';
import { authorizeRole } from '../../middlewares/verifyUserRole.js';

const router = Router();

router.post(
    '/create',
    verifyAccessToken,
    authorizeRole(['admin', 'student']),
    complainController.createComplain,
); //studnet middleware, complain text, title  cannt be same , within same studnetId

router.get(
    '/',
    verifyAccessToken,
    authorizeRole(['admin', 'student']),
    complainController.getAllComplains,
); //admin, studnet middleware

// patch /:id add tag, assign, reply, comment authenticate role: chairman, dec comm
router.patch('/:id' , verifyAccessToken,
    authorizeRole(['chairman', 'decision committee']), complainController.editComplain)

export default router;
