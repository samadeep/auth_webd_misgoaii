import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { config } from '../config/config';   // holds env-driven settings
import { BadRequest, Conflict, Unauthorized } from '../utils/httpErrors';

// ------------------ helpers --------------------------------------------------

const SALT_ROUNDS = 12;

const signJwt = (userId: string) =>
  jwt.sign({ _id: userId }, config.jwtSecret, { expiresIn: '7d' });

interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

// ------------------ validators ----------------------------------------------

const validateRegister = (body: any) => {
  const { email, password, name } = body;
  if (
    typeof email !== 'string' ||
    !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    throw new BadRequest('Invalid input');
  }
};

// ------------------ controllers ---------------------------------------------

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegister(req.body);

    const { email, password, name } = req.body;
    if (await User.exists({ email })) {
      throw new Conflict('User already exists');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password: hashed,
      name
    }) as IUser & { _id: string };

    const response: AuthResponse = {
      token: signJwt(user._id),
      user: { 
        id: user._id,
        email: user.email,
        name: user.name
      }
    };

    return res.status(201).json(response);
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequest('Email & password required');

    const user = await User.findOne({ email }).select('+password') as (IUser & { _id: string; password: string }) | null;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Unauthorized('Invalid credentials');
    }

    const response: AuthResponse = {
      token: signJwt(user._id),
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};
