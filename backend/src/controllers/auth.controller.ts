import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { AppError } from '../utils/AppError';
import { sendEmail } from '../utils/email';
import jwt from 'jsonwebtoken';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as any,
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend code if not verified
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.verificationCode = code;
        existingUser.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();
        
        await sendEmail({
          to: email,
          subject: 'GigFlow - Your Verification Code',
          text: `Welcome to GigFlow! Your 6-digit verification code is: ${code}. It will expire in 10 minutes.`,
        });

        return res.status(200).json({ status: 'pending_verification', message: 'Verification code sent', email });
      }
      return next(new AppError('Email already in use', 400));
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationCode: code,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    });

    // Send Email
    await sendEmail({
      to: email,
      subject: 'GigFlow - Your Verification Code',
      text: `Welcome to GigFlow! Your 6-digit verification code is: ${code}. It will expire in 10 minutes.`,
    });

    res.status(201).json({
      status: 'pending_verification',
      message: 'Verification code sent',
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return next(new AppError('Please provide email and verification code', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('Email is already verified. Please login.', 400));
    }

    if (user.verificationCode !== code || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return next(new AppError('Invalid or expired verification code', 400));
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    const token = signToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;
    if (!email) return next(new AppError('Please provide an email to invite', 400));

    await sendEmail({
      to: email,
      subject: 'You have been invited to GigFlow!',
      text: `Hello! You have been invited to join the GigFlow platform as a ${role || 'Sales Representative'}. Please visit our website to sign up and start managing smart leads!`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Invitation sent successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.isVerified) {
      return next(new AppError('Please verify your email address first', 403));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, bio } = req.body;
    
    // We shouldn't update email or password here
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { name, bio },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user?.id).select('+password');
    if (!user) return next(new AppError('User not found', 404));

    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Your current password is wrong', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id.toString());
    
    res.status(200).json({
      status: 'success',
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
