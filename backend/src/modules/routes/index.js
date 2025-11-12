import express from 'express';
// import userRouter from './user.routes.js';
import authRouter from '../auth/auth.routes.js';
import adminRouter from '../admin/admin.routes.js';

const router = express.Router();

router.get('/health', (_req, res) =>
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    }),
);


router.use('/', authRouter);
router.use('/admin', adminRouter);

export default router;
