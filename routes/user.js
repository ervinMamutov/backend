import express from 'express';
import userControllers from '../controllers/user.js';

const router = express.Router();

router.post('/register', userControllers.register);
router.post('/log-in', userControllers.login);
router.post('/log-out', userControllers.logout);

export default router;
