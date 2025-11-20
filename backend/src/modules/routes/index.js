import express from 'express';
// import userRouter from './user.routes.js';
import authRouter from '../auth/auth.routes.js';
import adminRouter from '../admin/admin.routes.js';
import complainRouter from "../complain/complain.routes.js"
import { Resend } from 'resend';

const router = express.Router();

router.get('/health', (req, res) =>
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    }),
);

// Create a test account or replace with real credentials.
const resend = new Resend('re_TcfLWueh_Q4jmhBpr7Gdv7i65wbRXHWmS');

router.use('/', authRouter);
router.use('/admin', adminRouter);
router.use("/complain", complainRouter)

export default router;
