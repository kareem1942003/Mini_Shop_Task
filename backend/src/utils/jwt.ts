import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../types';

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
}
