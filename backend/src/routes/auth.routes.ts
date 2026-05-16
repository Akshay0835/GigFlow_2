import express from 'express';
import { register, login, getMe, verifyEmail, inviteMember, updateMe, updatePassword } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { protect, restrictTo } from '../middlewares/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for OTP/Email sending
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each email to 3 requests per windowMs
  keyGenerator: (req) => {
    return req.body.email ? req.body.email.toLowerCase() : req.ip || 'unknown';
  },
  message: {
    status: 'error',
    message: 'Too many OTP requests for this email, please try again after 10 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', otpLimiter, validate(registerSchema), register);
router.post('/verify', verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/invite', protect, restrictTo('Admin'), otpLimiter, inviteMember);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/updatePassword', protect, updatePassword);

export default router;
