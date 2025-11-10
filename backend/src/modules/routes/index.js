import express from 'express';
import userRouter from './user.routes.js';
import authRouter from './auth.routes.js';

const router = express.Router();

router.get('/health', (_req, res) =>
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    }),
);

router.use('/users', userRouter);
router.use('/', authRouter);

export default router;
