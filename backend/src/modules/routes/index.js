import express from 'express';
// import userRouter from './user.routes.js';
import authRouter from '../auth/auth.routes.js';
import adminRouter from '../admin/admin.routes.js';
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

router.get('/send', async (req, res) => {
    const { data, error } = await resend.emails.send({
        from: 'Grivence System Email Testing <ComplaintSystem@resend.dev>',
        to: ['ahmedhussainnow@gmail.com', "jadid.muntasir2002@gmail.com",],
        subject: 'hello world',
        html: '<strong>it works!</strong>',
    });

    // console.log('email sent', info.messageId);
    res.json({ data });
});

router.use('/', authRouter);
router.use('/admin', adminRouter);

export default router;
