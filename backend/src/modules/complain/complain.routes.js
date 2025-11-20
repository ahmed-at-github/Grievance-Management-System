import { Router } from 'express';

const router = Router();

router.post('/create', (req, res) => {
    res.json({ message: 'create complain' });
});

export default router;
