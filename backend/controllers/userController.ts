import User from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from 'deep-email-validator';

const isEmailValid = async (email: string) => {
  return await validate(email);
};

const userSignup = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // ✅ DEV BYPASS for email validation
  const isDev = process.env.NODE_ENV !== 'production';
  const { valid } = isDev ? { valid: true } : await isEmailValid(email);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Hash password and save
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, username, password: hashedPassword });

  return res.status(200).json({ message: 'User created successfully' });
};

const userSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'User does not exist!' });

  const passwordValidates = await bcrypt.compare(password, user.password as string);

  if (passwordValidates) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string);
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: 'Wrong email or password' });
  }
};

const getUser = async (req: Request, res: Response) => {
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({ email: user.email, username: user.username });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

export { userSignup, userSignin, getUser };
