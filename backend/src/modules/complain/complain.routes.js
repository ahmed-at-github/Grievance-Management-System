import { Router } from 'express';
import * as complainController from './complain.controller.js';
import { verifyAccessToken } from '../../middlewares/verifyJwtToken.js';
import { authorizeRole } from '../../middlewares/verifyUserRole.js';

const router = Router();

router.post(
    '/create',
    verifyAccessToken,
    authorizeRole(['student']),
    complainController.createComplain,
); //studnet middleware, complain text, title  cannt be same , within same studnetId

router.get(
    '/',
    verifyAccessToken,
    authorizeRole(['admin', 'student', 'chairman', 'decision committee']),
    complainController.getAllComplains,
); //admin, studnet middleware

router.get(
    '/:id',
    verifyAccessToken,
    authorizeRole(['admin', 'student', 'chairman', 'decision committee']),
    complainController.getAllPvtComplains,
); //private complain to specific rstudent & role 

// patch /:id add tag, assign, reply, comment authenticate role: chairman, dec comm
router.patch('/:id' , verifyAccessToken,
    authorizeRole(['chairman', 'decision committee', 'student']), complainController.editComplain)

router.delete('/:id', verifyAccessToken, authorizeRole(['student']), complainController.deleteComplain) //only studnet 

export default router;
