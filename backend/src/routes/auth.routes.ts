import express from 'express';
import { register, login, getMe, verifyEmail, inviteMember, updateMe, updatePassword } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { protect, restrictTo } from '../middlewares/auth';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify', verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/invite', protect, restrictTo('Admin'), inviteMember);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/updatePassword', protect, updatePassword);

export default router;
