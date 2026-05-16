import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  Admin = 'Admin',
  Sales = 'Sales',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  bio?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Sales,
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot be more than 200 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);

  next();
});

// Method to check if entered password matches hashed password in DB
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
